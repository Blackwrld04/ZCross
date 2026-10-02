import { NextRequest, NextResponse } from 'next/server';
import { swapStore } from '@/core/solver/store';
import { solverEngine } from '@/core/solver/engine';
import { 
  evaluateRateLimit, 
  getClientIp, 
  createRateLimitResponse, 
  attachRateLimitHeaders 
} from '@/core/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting (60 requests / minute per client IP)
  const clientIp = getClientIp(req);
  const rateLimitResult = evaluateRateLimit(clientIp, {
    limit: 60,
    windowMs: 60_000,
    prefix: 'swap_detail',
  });

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const swapId = params.id;
    if (!swapId || !/^[a-zA-Z0-9_-]{8,64}$/.test(swapId)) {
      return NextResponse.json({ error: 'Invalid swap ID format' }, { status: 400 });
    }

    const swap = swapStore.getSwap(swapId);

    if (!swap) {
      return NextResponse.json({ error: 'Swap not found' }, { status: 404 });
    }

    const events = swapStore.getEvents(swapId);
    let receipt = null;
    if (swap.status === 'SETTLED') {
      receipt = solverEngine.buildReceipt(swap);
    }

    const res = NextResponse.json({
      success: true,
      swap,
      events,
      receipt,
    });
    return attachRateLimitHeaders(res, rateLimitResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
