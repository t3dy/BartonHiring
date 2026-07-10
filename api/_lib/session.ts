import crypto from 'crypto';
import type { ApiRequest, ApiResponse } from './http.js';
import { parseCookies } from './http.js';

const COOKIE_NAME = 'bsm_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours, same ballpark as a PHP session

export interface AdminSession {
  id: number;
  email: string;
  name: string;
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET is not configured');
  return s;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createSessionCookie(user: AdminSession): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = JSON.stringify({ ...user, exp: expires });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = sign(encoded);
  const token = `${encoded}.${signature}`;
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function readSession(req: ApiRequest): AdminSession | null {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export function requireAuth(req: ApiRequest, res: ApiResponse): AdminSession | null {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ error: 'Authentication required' });
    return null;
  }
  return session;
}
