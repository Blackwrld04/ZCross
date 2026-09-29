import { NextRequest, NextResponse } from 'next/server';
import { solverEngine } from '@/core/solver/engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
    });

    return NextResponse.json({
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
    });
  } catch (err: any) {
    console.error('[API /quote error]:', err);
    return NextResponse.json(
      { error: err.message || 'Internal quote calculation error' },
      { status: 400 }
    );
  }
}
