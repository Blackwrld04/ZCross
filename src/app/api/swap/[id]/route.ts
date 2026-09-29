import { NextRequest, NextResponse } from 'next/server';
import { swapStore } from '@/core/solver/store';
import { solverEngine } from '@/core/solver/engine';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const swapId = params.id;
    const swap = swapStore.getSwap(swapId);

    if (!swap) {
      return NextResponse.json({ error: 'Swap not found' }, { status: 404 });
    }

    const events = swapStore.getEvents(swapId);
    let receipt = null;
    if (swap.status === 'SETTLED') {
      receipt = solverEngine.buildReceipt(swap);
    }

    return NextResponse.json({
      success: true,
      swap,
      events,
      receipt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
