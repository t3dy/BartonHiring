import { getPool } from './_lib/db.js';
import { jsonInput, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { requireAuth } from './_lib/session.js';
import { defaultRates, normalizeRates } from './_lib/pricing.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const db = getPool();

  if (req.method === 'GET') {
    if (req.query.public !== '1') {
      if (!requireAuth(req, res)) return;
    }
    const { rows } = await db.query('SELECT mode, rates, updated_at FROM rate_settings ORDER BY updated_at DESC LIMIT 1');
    const row = rows[0];
    if (!row) {
      res.status(200).json({ mode: 'normal', rates: defaultRates() });
      return;
    }
    row.rates = normalizeRates(row.rates) ?? defaultRates();
    res.status(200).json(row);
    return;
  }

  if (req.method === 'POST') {
    if (!requireAuth(req, res)) return;
    const d = jsonInput(req);
    const mode = d.mode as string | undefined;
    if (!mode || !['normal', 'winter', 'custom'].includes(mode)) {
      res.status(400).json({ error: 'Invalid mode' });
      return;
    }
    const rates = normalizeRates(d.rates);
    if (!rates) {
      res.status(400).json({ error: 'Invalid rates' });
      return;
    }
    await db.query('DELETE FROM rate_settings');
    await db.query('INSERT INTO rate_settings (mode, rates, updated_at) VALUES ($1, $2, NOW())', [
      mode,
      JSON.stringify(rates),
    ]);
    res.status(200).json({ success: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
