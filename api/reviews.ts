import { getPool } from './_lib/db.js';
import type { ApiRequest, ApiResponse } from './_lib/http.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const limit = Math.min(parseInt(String(req.query.limit ?? '10'), 10) || 10, 50);

  try {
    const db = getPool();
    const { rows } = await db.query(
      `SELECT author_name, rating, text, created_at FROM google_reviews
       WHERE rating = 5 AND text IS NOT NULL AND text != ''
       ORDER BY RANDOM() LIMIT $1`,
      [limit]
    );
    const reviews = rows.map((r) => ({ ...r, rating: Number(r.rating) }));

    const count = await db.query('SELECT COUNT(*) AS total FROM google_reviews WHERE rating = 5');

    res.status(200).json({
      reviews,
      total_reviews: parseInt(count.rows[0].total, 10),
      rating: 5.0,
    });
  } catch (e) {
    console.error('Reviews fetch error:', e);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
