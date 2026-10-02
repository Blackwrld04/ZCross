import { NextRequest, NextResponse } from 'next/server';
import { swapStore } from '@/core/solver/store';
import { 
  evaluateRateLimit, 
  getClientIp, 
  createRateLimitResponse, 
  attachRateLimitHeaders 
} from '@/core/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = evaluateRateLimit(clientIp, {
    limit: 60,
    windowMs: 60_000,
    prefix: 'swap_list',
  });

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '30', 10);
    const swaps = swapStore.getAllSwaps(limit);

    const res = NextResponse.json({
      success: true,
      swaps,
    });
    return attachRateLimitHeaders(res, rateLimitResult);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch swaps' },
      { status: 500 }
    );
  }
}
