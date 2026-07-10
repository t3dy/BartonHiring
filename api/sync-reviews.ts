import crypto from 'crypto';
import { getPool } from './_lib/db.js';
import type { ApiRequest, ApiResponse } from './_lib/http.js';

interface GooglePlaceReview {
  author_name?: string;
  text?: string;
  rating?: number;
  time?: number;
  relative_time_description?: string;
  profile_photo_url?: string;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const secret = process.env.REVIEWS_SYNC_SECRET;
  if (!secret || req.query.key !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!placeId || !apiKey) {
    res.status(500).json({ error: 'Google Places sync is not configured' });
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?${new URLSearchParams({
    place_id: placeId,
    fields: 'reviews,rating,user_ratings_total,name',
    key: apiKey,
  })}`;

  const response = await fetch(url);
  if (!response.ok) {
    res.status(500).json({ error: 'Failed to fetch from Google' });
    return;
  }

  const data = await response.json();
  if (!data?.result?.reviews) {
    res.status(500).json({ error: 'No reviews in response', status: data?.status ?? 'unknown' });
    return;
  }

  const reviews: GooglePlaceReview[] = data.result.reviews;
  const db = getPool();
  let inserted = 0;
  let skipped = 0;

  for (const r of reviews) {
    const author = r.author_name ?? '';
    const text = r.text ?? '';
    const rating = r.rating ?? 5;
    const timeEpoch = r.time ?? 0;
    const relativeTime = r.relative_time_description ?? '';
    const photoUrl = r.profile_photo_url ?? null;

    const reviewId = 'sync-' + crypto.createHash('md5').update(`${author}|${text}`).digest('hex');

    const check = await db.query(
      `SELECT id FROM google_reviews WHERE review_id = $1 OR (author_name = $2 AND LEFT(text, 100) = LEFT($3, 100))`,
      [reviewId, author, text]
    );
    if (check.rows[0]) {
      skipped++;
      continue;
    }

    await db.query(
      `INSERT INTO google_reviews (author_name, author_photo_url, rating, text, relative_time, time_epoch, review_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [author, photoUrl, rating, text, relativeTime, timeEpoch, reviewId]
    );
    inserted++;
  }

  const result = data.result;
  await db.query(
    `INSERT INTO google_business_info (place_id, name, rating, total_reviews, updated_at)
     VALUES ($1,$2,$3,$4,NOW())
     ON CONFLICT (place_id) DO UPDATE SET rating = $3, total_reviews = $4, updated_at = NOW()`,
    [placeId, result.name ?? 'Barton Springs Moving', result.rating ?? 5.0, result.user_ratings_total ?? 0]
  );

  const total = await db.query('SELECT COUNT(*) AS c FROM google_reviews');

  res.status(200).json({
    success: true,
    inserted,
    skipped,
    total_in_db: parseInt(total.rows[0].c, 10),
    google_total: result.user_ratings_total ?? 0,
    google_rating: result.rating ?? 0,
  });
}
