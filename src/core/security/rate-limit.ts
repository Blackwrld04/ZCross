
import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  prefix?: string;
}

interface ClientBucket {
  count: number;
  resetAt: number;
}

const bucketStore = new Map<string, ClientBucket>();

let lastCleanup = Date.now();
function cleanupExpiredBuckets() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  for (const [key, bucket] of bucketStore.entries()) {
    if (bucket.resetAt <= now) {
      bucketStore.delete(key);
    }
  }
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function evaluateRateLimit(
  clientId: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanupExpiredBuckets();

  const now = Date.now();
  const key = `${options.prefix || 'rl'}:${clientId}`;
  const bucket = bucketStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucketStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit - 1,
      resetMs: options.windowMs,
    };
  }

  bucket.count += 1;
  const remaining = Math.max(0, options.limit - bucket.count);
  const resetMs = Math.max(0, bucket.resetAt - now);

  if (bucket.count > options.limit) {
    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetMs,
    };
  }

  return {
    allowed: true,
    limit: options.limit,
    remaining,
    resetMs,
  };
}

export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const retrySec = Math.ceil(result.resetMs / 1000);
  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Please wait ${retrySec} second(s) before retrying.`,
      retryAfterSeconds: retrySec,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retrySec),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil((Date.now() + result.resetMs) / 1000)),
      },
    }
  );
}

export function attachRateLimitHeaders(res: NextResponse, result: RateLimitResult): NextResponse {
  res.headers.set('X-RateLimit-Limit', String(result.limit));
  res.headers.set('X-RateLimit-Remaining', String(result.remaining));
  res.headers.set('X-RateLimit-Reset', String(Math.ceil((Date.now() + result.resetMs) / 1000)));
  return res;
}

export async function evaluateDistributedRateLimit(
  clientId: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { redisClient } = await import('../storage/redis-client');
  const key = `${options.prefix || 'rl_dist'}:${clientId}`;
  const windowSec = Math.ceil(options.windowMs / 1000);

  const count = await redisClient.incr(key, windowSec);
  const allowed = count <= options.limit;
  const remaining = Math.max(0, options.limit - count);

  return {
    allowed,
    limit: options.limit,
    remaining,
    resetMs: options.windowMs,
  };
}

