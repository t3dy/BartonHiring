import { getPool } from './_lib/db.js';
import { jsonInput, type ApiRequest, type ApiResponse } from './_lib/http.js';
import { readSession, createSessionCookie, clearSessionCookie } from './_lib/session.js';
import { verifyPasswordHash } from './_lib/password.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === 'GET') {
    const session = readSession(req);
    if (session) {
      res.status(200).json({ authenticated: true, user: session });
      return;
    }
    res.status(200).json({ authenticated: false });
    return;
  }

  if (req.method === 'POST') {
    const input = jsonInput(req);
    const action = input.action;

    if (action === 'logout') {
      res.setHeader('Set-Cookie', clearSessionCookie());
      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'login') {
      const email = String(input.email ?? '');
      const password = String(input.password ?? '');

      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' });
        return;
      }

      const db = getPool();
      const { rows } = await db.query(
        'SELECT id, email, name, password_hash, is_active FROM admin_users WHERE email = $1 LIMIT 1',
        [email]
      );
      const user = rows[0];

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const valid = await verifyPasswordHash(password, user.password_hash);
      if (!valid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      if (!user.is_active) {
        res.status(403).json({ error: 'Account is disabled' });
        return;
      }

      await db.query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [user.id]);

      const session = { id: user.id, email: user.email, name: user.name };
      res.setHeader('Set-Cookie', createSessionCookie(session));
      res.status(200).json({ ok: true, user: session });
      return;
    }

    res.status(400).json({ error: 'Unknown action' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
