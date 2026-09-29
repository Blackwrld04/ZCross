import { NextRequest, NextResponse } from 'next/server';
import { solverEngine } from '@/core/solver/engine';
import { swapStore } from '@/core/solver/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ success: true, swap: updated });
    }

    if (action === 'settle') {
      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swapId);
      return NextResponse.json({ success: true, swap: settled, receipt });
    }

    if (action === 'full_flow') {
      // Step 1: Deposit & Memo verification
      await solverEngine.processShieldedDeposit(swapId);
      // Step 2: Settlement
      const { swap: settled, receipt } = await solverEngine.fulfillSwap(swapId);
      return NextResponse.json({ success: true, swap: settled, receipt });
    }

    return NextResponse.json({ error: 'Invalid action. Supported: deposit, settle, full_flow' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
