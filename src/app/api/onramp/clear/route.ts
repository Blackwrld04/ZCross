import { NextRequest, NextResponse } from 'next/server';
import { globalOnrampStore } from '@/core/onramp/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    const order = globalOnrampStore.simulateOrderClearance(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      cleared: true,
      order,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to clear order' },
      { status: 500 }
    );
  }
}
