
import { NextRequest } from 'next/server';

interface CachedIdempotentResponse {
  statusCode: number;
  body: any;
  createdAt: number;
}

const idempotencyStore = new Map<string, CachedIdempotentResponse>();

const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

export function isValidIdempotencyKey(key?: string | null): boolean {
  if (!key) return false;
  const clean = key.trim();
  return /^[a-zA-Z0-9_-]{8,128}$/.test(clean);
}

export function getIdempotencyKey(req: NextRequest): string | null {
  const key = req.headers.get('idempotency-key') || req.headers.get('x-idempotency-key');
  if (!key) return null;
  const clean = key.trim();
  if (isValidIdempotencyKey(clean)) {
    return clean;
  }
  return null;
}

export function getCachedIdempotentResponse(key: string): CachedIdempotentResponse | null {
  const cached = idempotencyStore.get(key);
  if (!cached) return null;

  if (Date.now() - cached.createdAt > IDEMPOTENCY_TTL_MS) {
    idempotencyStore.delete(key);
    return null;
  }

  return cached;
}

export function saveIdempotentResponse(key: string, statusCode: number, body: any): void {
  idempotencyStore.set(key, {
    statusCode,
    body,
    createdAt: Date.now(),
  });
}
