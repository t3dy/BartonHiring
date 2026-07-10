import crypto from 'crypto';
import bcrypt from 'bcryptjs';

function base64urlDecode(value: string): Buffer {
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64');
}

export async function verifyPasswordHash(password: string, storedHash: string): Promise<boolean> {
  if (storedHash.startsWith('pbkdf2_sha256$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    if (!iterations || iterations < 100000) return false;
    const salt = base64urlDecode(parts[2]);
    const expected = base64urlDecode(parts[3]);
    const actual = crypto.pbkdf2Sync(password, salt, iterations, expected.length, 'sha256');
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  }

  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    // bcryptjs doesn't understand the $2y$ variant tag PHP uses; normalize to $2b$ (identical algorithm).
    const normalized = storedHash.startsWith('$2y$') ? '$2b$' + storedHash.slice(4) : storedHash;
    return bcrypt.compare(password, normalized);
  }

  const sha256 = crypto.createHash('sha256').update(password).digest('hex');
  const a = Buffer.from(sha256);
  const b = Buffer.from(storedHash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
