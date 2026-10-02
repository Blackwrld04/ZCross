import { NextRequest, NextResponse } from 'next/server';
import { refundEngine } from '@/core/solver/refunds';
import { 
  evaluateRateLimit, 
  getClientIp, 
  createRateLimitResponse, 
  attachRateLimitHeaders 
} from '@/core/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitResult = evaluateRateLimit(clientIp, {
    limit: 15,
    windowMs: 60_000,
    prefix: 'refunds',
  });

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const outcome = await refundEngine.checkAndExecuteRefunds();
    const res = NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...outcome,
    });
    return attachRateLimitHeaders(res, rateLimitResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
