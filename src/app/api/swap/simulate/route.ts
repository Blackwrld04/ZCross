import { NextRequest, NextResponse } from 'next/server';
import { solverEngine } from '@/core/solver/engine';
import { swapStore } from '@/core/solver/store';
import { 
  evaluateRateLimit, 
  getClientIp, 
  createRateLimitResponse, 
  attachRateLimitHeaders 
} from '@/core/security/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Strict rate limit on simulation executions (10 requests / minute per client IP)
  const clientIp = getClientIp(req);
  const rateLimitResult = evaluateRateLimit(clientIp, {
    limit: 10,
    windowMs: 60_000,
    prefix: 'simulate',
  });

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const body = await req.json();
    const { swapId, action } = body;

    if (!swapId) {
      return NextResponse.json({ error: 'Missing swapId' }, { status: 400 });
    }

    const swap = swapStore.getSwap(swapId);
    if (!swap) {
      return NextResponse.json({ error: 'Swap not found' }, { status: 404 });
    }

    if (action === 'deposit') {
      const updated = await solverEngine.processShieldedDeposit(swapId);
      const res = NextResponse.json({ success: true, swap: updated });
      return attachRateLimitHeaders(res, rateLimitResult);
    }

    if (action === 'settle') {
      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swapId);
      const res = NextResponse.json({ success: true, swap: settled, receipt });
      return attachRateLimitHeaders(res, rateLimitResult);
    }

    if (action === 'full_flow') {
      // Step 1: Deposit & Memo verification
      await solverEngine.processShieldedDeposit(swapId);
      // Step 2: Settlement
      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swapId);
      const res = NextResponse.json({ success: true, swap: settled, receipt });
      return attachRateLimitHeaders(res, rateLimitResult);
    }

    return NextResponse.json({ error: 'Invalid action. Supported: deposit, settle, full_flow' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
