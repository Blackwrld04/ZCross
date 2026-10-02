import { NextResponse } from 'next/server';
import { defuseSolverManager } from '@/core/near-intents/defuse-solver';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await defuseSolverManager.getSolverStatus();
    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve Defuse solver status',
      },
      { status: 500 }
    );
  }
}
