import { getPool } from './_lib/db.js';
import { jsonInput, newId, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { requireAuth } from './_lib/session.js';

const MAX_BYTES_BY_TYPE: Record<string, number> = {
  photo: 14 * 1024 * 1024,
  video: 70 * 1024 * 1024,
};

function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  if (comma === -1) return dataUrl.length;
  const payload = dataUrl.slice(comma + 1);
  return Math.ceil((payload.length * 3) / 4);
}

interface MediaRow {
  file_url: string | null;
  file_data: string | null;
  file_type: string;
  original_name: string | null;
}

function streamMediaResponse(res: ApiResponse, req: ApiRequest, media: MediaRow): void {
  const source = media.file_url || media.file_data;
  if (!source) {
    res.status(404).json({ error: 'Media payload not found' });
    return;
  }

  if (/^https?:\/\//.test(source)) {
    res.status(302).setHeader('Location', source);
    res.end();
    return;
  }

  const match = source.match(/^data:([^;,]+)(?:;[^,]*)?;base64,([\s\S]*)$/);
  if (!match) {
    res.status(500).json({ error: 'Invalid media payload' });
    return;
  }

  const mime = match[1] || (media.file_type === 'video' ? 'video/mp4' : 'image/jpeg');
  const binary = Buffer.from(match[2], 'base64');

  const size = binary.length;
  let start = 0;
  let end = size - 1;
  let status = 200;

  const range = req.headers.range as string | undefined;
  const rangeMatch = range?.match(/bytes=(\d*)-(\d*)/);
  if (rangeMatch) {
    if (rangeMatch[1] !== '') start = Math.max(0, parseInt(rangeMatch[1], 10));
    if (rangeMatch[2] !== '') end = Math.min(end, parseInt(rangeMatch[2], 10));
    if (start <= end) {
      status = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
    }
  }

  const length = end - start + 1;
  let filename = media.original_name || (media.file_type === 'video' ? 'quote-video' : 'quote-photo');
  filename = filename.replace(/[^A-Za-z0-9._-]/g, '_');

  res.status(status);
  res.setHeader('Content-Type', mime);
  res.setHeader('Content-Length', String(length));
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.end(binary.subarray(start, start + length));
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const db = getPool();

  if (req.method === 'POST') {
    const d = jsonInput(req);
    const quoteId = d.quote_id as string | undefined;
    const fileData = d.file_data as string | undefined;
    const fileType = d.file_type as string | undefined;

    if (!quoteId || !fileData || !fileType) {
      res.status(400).json({ error: 'quote_id, file_data, and file_type are required' });
      return;
    }
    if (!MAX_BYTES_BY_TYPE[fileType]) {
      res.status(400).json({ error: 'Invalid file_type' });
      return;
    }

    const expectedPrefix = fileType === 'photo' ? 'data:image/' : 'data:video/';
    if (!fileData.startsWith(expectedPrefix) || dataUrlBytes(fileData) > MAX_BYTES_BY_TYPE[fileType]) {
      res.status(400).json({ error: 'Invalid or oversized media upload' });
      return;
    }

    const qcheck = await db.query(
      "SELECT id FROM move_quotes WHERE id = $1 AND created_at > NOW() - INTERVAL '1 hour'",
      [quoteId]
    );
    if (!qcheck.rows[0]) {
      res.status(404).json({ error: 'Quote not found or upload window expired' });
      return;
    }

    const id = newId();
    const { rows } = await db.query(
      `INSERT INTO media_files (id, quote_id, file_data, file_type, created_at)
       VALUES ($1,$2,$3,$4,NOW())
       RETURNING id, quote_id, file_type, created_at`,
      [id, quoteId, fileData, fileType]
    );

    res.status(200).json(rows[0]);
    return;
  }

  if (req.method === 'GET') {
    if (!requireAuth(req, res)) return;

    const id = req.query.id as string | undefined;
    if (id && req.query.raw === '1') {
      const { rows } = await db.query(
        'SELECT id, quote_id, file_url, file_data, file_type, original_name, created_at FROM media_files WHERE id = $1',
        [id]
      );
      if (!rows[0]) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      streamMediaResponse(res, req, rows[0]);
      return;
    }

    const quoteId = req.query.quote_id as string | undefined;
    if (!quoteId) {
      res.status(400).json({ error: 'quote_id required' });
      return;
    }

    const { rows } = await db.query(
      `SELECT id, quote_id,
              CASE WHEN file_url IS NOT NULL AND LENGTH(file_url) > 0 THEN file_url ELSE '/api/media?id=' || id || '&raw=1' END AS file_data,
              file_url, file_type, original_name, created_at
       FROM media_files WHERE quote_id = $1 ORDER BY created_at`,
      [quoteId]
    );
    res.status(200).json(rows);
    return;
  }

  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;
    const d = jsonInput(req);
    const id = d.id as string | undefined;
    if (!id) {
      res.status(400).json({ error: 'id required' });
      return;
    }
    await db.query('DELETE FROM media_files WHERE id = $1', [id]);
    res.status(200).json({ success: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
