import { NextResponse } from 'next/server';
import { zcashNodeClient } from '@/core/zcash/node-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await zcashNodeClient.getNodeStatus();
    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to check Zcash node status' },
      { status: 500 }
    );
  }
}
