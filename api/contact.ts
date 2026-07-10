import { getPool } from './_lib/db.js';
import { jsonInput, newId, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { ntfy, pushSmartMovingLead } from './_lib/notify.js';

function cleanString(value: unknown, max: number): string {
  return String(value ?? '').trim().slice(0, max);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const d = jsonInput(req);

  const lead = {
    name: cleanString(d.name, 120),
    phone: cleanString(d.phone, 32),
    email: cleanString(d.email, 255).toLowerCase(),
    marketing_opt_in: Boolean(d.marketing_opt_in),
  };

  if (!lead.name || !lead.phone || !lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }

  const id = newId();
  const db = getPool();
  await db.query(
    `INSERT INTO contact_leads (id, name, phone, email, marketing_opt_in, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())`,
    [id, lead.name, lead.phone, lead.email, lead.marketing_opt_in]
  );

  await ntfy(
    'barton-springs-moving-quotes',
    'New Contact Form Lead',
    'bust_in_silhouette,incoming_envelope',
    `Customer: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nSource: Contact Popup`
  );

  await pushSmartMovingLead({
    fullName: lead.name,
    phoneNumber: lead.phone,
    email: lead.email,
    userOptIn: lead.marketing_opt_in,
    referralSource: 'Contact Popup',
  });

  res.status(200).json({ id });
}
