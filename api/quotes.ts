import { getPool } from './_lib/db.js';
import { jsonInput, newId, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { trustedQuote } from './_lib/pricing.js';
import { requireAuth } from './_lib/session.js';
import { ntfy } from './_lib/notify.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const db = getPool();

  if (req.method === 'POST') {
    const d = jsonInput(req);

    let quote;
    try {
      quote = await trustedQuote(d, db);
    } catch (e) {
      res.status(400).json({ error: e instanceof Error ? e.message : 'Invalid data' });
      return;
    }

    const id = newId();
    await db.query(
      `INSERT INTO move_quotes (
        id, name, phone, email, comments, property_type, square_footage, floors,
        has_elevator, is_internal_unit, start_address, end_address, distance_miles,
        parking_difficulty, packing_service, payment_method, has_specialty_items,
        specialty_items_count, estimated_cost, crew_size, hourly_rate, photo_count,
        video_count, marketing_opt_in, move_date, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,'new',NOW())`,
      [
        id, quote.name, quote.phone, quote.email, quote.comments || null, quote.property_type,
        quote.square_footage, quote.floors, quote.has_elevator, quote.is_internal_unit,
        quote.start_address, quote.end_address, quote.distance_miles, quote.parking_difficulty,
        quote.packing_service, quote.payment_method, quote.has_specialty_items,
        quote.specialty_items_count, quote.estimated_cost, quote.crew_size, quote.hourly_rate,
        quote.photo_count, quote.video_count, quote.marketing_opt_in, quote.move_date,
      ]
    );

    await ntfy(
      'barton-springs-moving-quotes',
      `New Moving Quote - $${quote.estimated_cost.toFixed(2)}`,
      'truck,money_with_wings',
      `Customer: ${quote.name}\nEmail: ${quote.email}\nPhone: ${quote.phone}\nEstimated: $${quote.estimated_cost.toFixed(2)}\nFrom: ${quote.start_address}\nTo: ${quote.end_address}\nDistance: ${quote.distance_miles.toFixed(1)} mi`
    );

    res.status(200).json({ id, status: 'new' });
    return;
  }

  if (req.method === 'GET') {
    if (!requireAuth(req, res)) return;

    const id = req.query.id as string | undefined;

    if (id) {
      const { rows } = await db.query('SELECT * FROM move_quotes WHERE id = $1', [id]);
      const quote = rows[0];
      if (!quote) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const media = await db.query(
        `SELECT id, quote_id,
                CASE WHEN file_url IS NOT NULL AND LENGTH(file_url) > 0 THEN file_url ELSE '/api/media?id=' || id || '&raw=1' END AS file_data,
                file_url, file_type, original_name, public_id, created_at
         FROM media_files WHERE quote_id = $1 ORDER BY created_at`,
        [id]
      );
      res.status(200).json({ quote, media: media.rows });
      return;
    }

    const status = req.query.status as string | undefined;
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '50'), 10) || 50, 1), 200);
    const offset = Math.max(parseInt(String(req.query.offset ?? '0'), 10) || 0, 0);

    let rows, total;
    if (status) {
      const r = await db.query(
        'SELECT * FROM move_quotes WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [status, limit, offset]
      );
      rows = r.rows;
      const c = await db.query('SELECT COUNT(*) AS total FROM move_quotes WHERE status = $1', [status]);
      total = parseInt(c.rows[0].total, 10);
    } else {
      const r = await db.query('SELECT * FROM move_quotes ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
      rows = r.rows;
      const c = await db.query('SELECT COUNT(*) AS total FROM move_quotes');
      total = parseInt(c.rows[0].total, 10);
    }

    res.status(200).json({ quotes: rows, total, limit, offset });
    return;
  }

  if (req.method === 'PUT') {
    if (!requireAuth(req, res)) return;
    const d = jsonInput(req);
    const id = d.id as string | undefined;
    const status = d.status as string | undefined;
    const allowed = ['new', 'in_progress', 'completed'];

    if (!id || !status || !allowed.includes(status)) {
      res.status(400).json({ error: 'id and valid status required' });
      return;
    }

    await db.query('UPDATE move_quotes SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    res.status(200).json({ success: true });
    return;
  }

  if (req.method === 'DELETE') {
    if (!requireAuth(req, res)) return;
    const d = jsonInput(req);
    const id = (req.query.id as string | undefined) ?? (d.id as string | undefined);
    if (!id) {
      res.status(400).json({ error: 'id required' });
      return;
    }
    await db.query('DELETE FROM media_files WHERE quote_id = $1', [id]);
    await db.query('DELETE FROM move_quotes WHERE id = $1', [id]);
    res.status(200).json({ success: true, deleted: id });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
