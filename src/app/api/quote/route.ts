import { NextRequest, NextResponse } from 'next/server';
import { solverEngine } from '@/core/solver/engine';
import { 
  evaluateRateLimit, 
  getClientIp, 
  createRateLimitResponse, 
  attachRateLimitHeaders 
} from '@/core/security/rate-limit';
import { 
  getIdempotencyKey, 
  getCachedIdempotentResponse, 
  saveIdempotentResponse 
} from '@/core/security/idempotency';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Check (20 requests / minute per client IP)
  const clientIp = getClientIp(req);
  const rateLimitResult = evaluateRateLimit(clientIp, {
    limit: 20,
    windowMs: 60_000,
    prefix: 'quote',
  });

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult);
  }

  // 2. Idempotency Check (Prevents duplicate quotes/intents on network retries)
  const idempotencyKey = getIdempotencyKey(req);
  if (idempotencyKey) {
    const cached = getCachedIdempotentResponse(idempotencyKey);
    if (cached) {
      const cachedRes = NextResponse.json(cached.body, { status: cached.statusCode });
      cachedRes.headers.set('X-Idempotent-Replay', 'true');
      return attachRateLimitHeaders(cachedRes, rateLimitResult);
    }
  }

  try {
    const body = await req.json();

    if (!body.originAmountZec || !body.destinationAsset || !body.recipientAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: originAmountZec, destinationAsset, recipientAddress' },
        { status: 400 }
      );
    }

    const result = await solverEngine.createIntent({
      originAmountZec: String(body.originAmountZec),
      destinationChain: body.destinationChain || 'arb',
      destinationAsset: body.destinationAsset,
      destinationTokenSymbol: body.destinationTokenSymbol || 'USDC',
      recipientAddress: body.recipientAddress,
      refundShieldedAddress: body.refundShieldedAddress,
      slippageBps: body.slippageBps ? Number(body.slippageBps) : 100,
      network: body.network || 'mainnet',
      chaffEnabled: Boolean(body.chaffEnabled),
      jitterDelaySeconds: body.jitterDelaySeconds ? Number(body.jitterDelaySeconds) : undefined,
    });

    const responsePayload = {
      success: true,
      swapId: result.swap.id,
      status: result.swap.status,
      depositUnifiedAddress: result.swap.deposit_ua,
      originAmountZec: result.swap.origin_amount,
      estimatedOutput: result.swap.dest_amount_est,
      minimumOutput: result.swap.dest_amount_min,
      destinationChain: result.swap.dest_chain,
      destinationToken: result.swap.dest_token,
      recipientAddress: result.swap.dest_recipient,
      deadline: result.swap.deadline,
      zip321Uri: result.zip321Uri,
      memoBase64: result.memoBase64,
      chaffEnabled: Boolean(result.swap.chaff_enabled),
      jitterDelaySeconds: result.swap.jitter_delay_seconds || 0,
    };

    if (idempotencyKey) {
      saveIdempotentResponse(idempotencyKey, 200, responsePayload);
    }

    const res = NextResponse.json(responsePayload);
    return attachRateLimitHeaders(res, rateLimitResult);
  } catch (err: any) {
    console.error('[API /quote error]:', err);
    return NextResponse.json(
      { error: err.message || 'Internal quote calculation error' },
      { status: 400 }
    );
  }
}
