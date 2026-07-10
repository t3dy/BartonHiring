import type { IncomingMessage, ServerResponse } from 'http';

export type ApiRequest = IncomingMessage & {
  method: string;
  query: Record<string, string | string[] | undefined>;
  body: unknown;
  cookies?: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
};

export type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  send: (body: unknown) => void;
  setHeader: (name: string, value: string | number | readonly string[]) => ApiResponse;
};

export function jsonResponse(res: ApiResponse, body: unknown, status = 200): void {
  res.status(status).json(body);
}

export function jsonInput(req: ApiRequest): Record<string, unknown> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

export function newId(): string {
  return crypto.randomUUID();
}

export function parseCookies(req: ApiRequest): Record<string, string> {
  const header = req.headers.cookie;
  const raw = Array.isArray(header) ? header.join('; ') : header || '';
  const out: Record<string, string> = {};
  raw.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  });
  return out;
}
