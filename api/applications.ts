import { getPool } from './_lib/db.js';
import { jsonInput, newId, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { requireAuth } from './_lib/session.js';
import { ntfy } from './_lib/notify.js';

const MAX_RESUME_BYTES = 8 * 1024 * 1024;

function cleanString(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

function boolVal(value: unknown): boolean {
  return Boolean(value);
}

function dataUrlSizeBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  if (comma === -1) return dataUrl.length;
  const payload = dataUrl.slice(comma + 1);
  return Math.ceil((payload.length * 3) / 4);
}

function validResumeDataUrl(dataUrl: string, maxBytes: number): boolean {
  const allowed = [
    'data:application/pdf',
    'data:application/msword',
    'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const prefixOk = allowed.some((p) => dataUrl.startsWith(p));
  return prefixOk && dataUrlSizeBytes(dataUrl) <= maxBytes;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const db = getPool();

  if (req.method === 'POST') {
    const d = jsonInput(req);

    const app = {
      full_name: cleanString(d.full_name, 120),
      phone: cleanString(d.phone, 32),
      email: cleanString(d.email, 255).toLowerCase(),
      city: cleanString(d.city, 120),
      zip: cleanString(d.zip, 20),
      years_experience: Math.min(Math.max(Math.trunc(Number(d.years_experience ?? 0)), 0), 60),
      availability: cleanString(d.availability, 500),
      earliest_start_date: DATE_RE.test(String(d.earliest_start_date ?? '')) ? (d.earliest_start_date as string) : null,
      felony_explanation: cleanString(d.felony_explanation, 2000),
      why_work_here: cleanString(d.why_work_here, 2000),
      how_heard_about_us: cleanString(d.how_heard_about_us, 255),
    };

    if (!app.full_name || !app.phone || !app.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) {
      res.status(400).json({ error: 'Invalid data' });
      return;
    }

    const id = newId();
    await db.query(
      `INSERT INTO job_applications (
        id, full_name, phone, email, city, zip, has_moving_experience, years_experience,
        has_drivers_license, has_cdl, has_box_truck_experience, can_lift_75_lbs,
        comfortable_with_stairs, availability, earliest_start_date, has_reliable_transportation,
        authorized_to_work, consent_background_check, has_felony, felony_explanation,
        why_work_here, how_heard_about_us, status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,'new',NOW())`,
      [
        id, app.full_name, app.phone, app.email, app.city || null, app.zip || null,
        boolVal(d.has_moving_experience), app.years_experience, boolVal(d.has_drivers_license),
        boolVal(d.has_cdl), boolVal(d.has_box_truck_experience), boolVal(d.can_lift_75_lbs),
        boolVal(d.comfortable_with_stairs), app.availability || null, app.earliest_start_date,
        boolVal(d.has_reliable_transportation), boolVal(d.authorized_to_work),
        boolVal(d.consent_background_check), boolVal(d.has_felony), app.felony_explanation || null,
        app.why_work_here || null, app.how_heard_about_us || null,
      ]
    );

    await ntfy(
      'barton-springs-moving-applications',
      `New Job Application - ${app.full_name}`,
      'clipboard',
      `Applicant: ${app.full_name}\nPhone: ${app.phone}\nEmail: ${app.email}\nAvailability: ${app.availability}`
    );

    res.status(200).json({ id, status: 'new' });
    return;
  }

  if (req.method === 'GET') {
    if (!requireAuth(req, res)) return;
    const id = req.query.id as string | undefined;
    if (id) {
      const { rows } = await db.query('SELECT * FROM job_applications WHERE id = $1', [id]);
      if (!rows[0]) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.status(200).json(rows[0]);
      return;
    }

    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '50'), 10) || 50, 1), 200);
    const offset = Math.max(parseInt(String(req.query.offset ?? '0'), 10) || 0, 0);
    const { rows } = await db.query(
      'SELECT * FROM job_applications ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const count = await db.query('SELECT COUNT(*) AS total FROM job_applications');

    res.status(200).json({
      applications: rows,
      total: parseInt(count.rows[0].total, 10),
      limit,
      offset,
    });
    return;
  }

  if (req.method === 'PUT') {
    const d = jsonInput(req);
    const id = d.id as string | undefined;
    if (!id) {
      res.status(400).json({ error: 'id required' });
      return;
    }

    if (d.resume_data !== undefined) {
      const resumeData = String(d.resume_data);
      if (!validResumeDataUrl(resumeData, MAX_RESUME_BYTES)) {
        res.status(400).json({ error: 'Invalid or oversized resume upload' });
        return;
      }

      const check = await db.query(
        "SELECT id FROM job_applications WHERE id = $1 AND created_at > NOW() - INTERVAL '1 hour'",
        [id]
      );
      if (!check.rows[0]) {
        res.status(404).json({ error: 'Application not found or upload window expired' });
        return;
      }

      await db.query(
        'UPDATE job_applications SET resume_file_url = $1, resume_public_id = $2 WHERE id = $3',
        [resumeData, cleanString(d.resume_filename ?? 'resume', 255), id]
      );
      res.status(200).json({ success: true });
      return;
    }

    if (!requireAuth(req, res)) return;
    const status = d.status as string | undefined;
    const allowed = ['new', 'reviewing', 'contacted', 'hired', 'rejected'];
    if (!status || !allowed.includes(status)) {
      res.status(400).json({ error: 'invalid status' });
      return;
    }

    await db.query('UPDATE job_applications SET status = $1 WHERE id = $2', [status, id]);
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
    await db.query('DELETE FROM job_applications WHERE id = $1', [id]);
    res.status(200).json({ success: true, deleted: id });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
