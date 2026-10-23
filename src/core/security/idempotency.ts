/**
 * Security: Idempotency Protection
 * Prevents double-spend and duplicate cross-chain intents caused by network retries.
 */

import { NextRequest } from 'next/server';

interface CachedIdempotentResponse {
  statusCode: number;
  body: any;
  createdAt: number;
}

// In-memory cache for idempotency responses (TTL: 10 minutes)
const idempotencyStore = new Map<string, CachedIdempotentResponse>();

const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;

/**
 * Validates whether an idempotency key string is valid (non-empty, alphanumeric with hyphens/underscores, 8-128 chars)
 */
export function isValidIdempotencyKey(key?: string | null): boolean {
  if (!key) return false;
  const clean = key.trim();
  return /^[a-zA-Z0-9_-]{8,128}$/.test(clean);
}

/**
 * Extracts Idempotency-Key from headers
 */
export function getIdempotencyKey(req: NextRequest): string | null {
  const key = req.headers.get('idempotency-key') || req.headers.get('x-idempotency-key');
  if (!key) return null;
  const clean = key.trim();
  if (isValidIdempotencyKey(clean)) {
    return clean;
  }
  return null;
}

/**
 * Checks if an idempotent response exists for the given key
 */
export function getCachedIdempotentResponse(key: string): CachedIdempotentResponse | null {
  const cached = idempotencyStore.get(key);
  if (!cached) return null;

  if (Date.now() - cached.createdAt > IDEMPOTENCY_TTL_MS) {
    idempotencyStore.delete(key);
    return null;
  }

  return cached;
}

/**
 * Stores an idempotent response
 */
export function saveIdempotentResponse(key: string, statusCode: number, body: any): void {
  idempotencyStore.set(key, {
    statusCode,
    body,
    createdAt: Date.now(),
  });
}
