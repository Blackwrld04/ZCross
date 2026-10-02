/**
 * Security: Sliding-Window Token Bucket Rate Limiter
 * Protects endpoints against denial-of-service, brute-force, and quote spam.
 */

import { NextRequest, NextResponse } from 'next/server';

export interface RateLimitOptions {
  /** Maximum number of allowed requests in the time window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Custom key prefix for different endpoint categories */
  prefix?: string;
}

interface ClientBucket {
  count: number;
  resetAt: number;
}

// In-memory bucket store with sliding expiry
const bucketStore = new Map<string, ClientBucket>();

// Periodic cleanup of expired client records every 60 seconds
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

/**
 * Extracts client IP from request headers or socket
 */
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

/**
 * Evaluates rate limit for a client request
 */
export function evaluateRateLimit(
  clientId: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanupExpiredBuckets();

  const now = Date.now();
  const key = `${options.prefix || 'rl'}:${clientId}`;
  const bucket = bucketStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    // New window initialized
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

  // Increment counter within current window
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

/**
 * Helper to generate 429 Too Many Requests response with standard security headers
 */
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

/**
 * Attaches rate limit information to successful response headers
 */
export function attachRateLimitHeaders(res: NextResponse, result: RateLimitResult): NextResponse {
  res.headers.set('X-RateLimit-Limit', String(result.limit));
  res.headers.set('X-RateLimit-Remaining', String(result.remaining));
  res.headers.set('X-RateLimit-Reset', String(Math.ceil((Date.now() + result.resetMs) / 1000)));
  return res;
}

/**
 * Distributed rate limiter across edge instances using Upstash Redis
 */
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

