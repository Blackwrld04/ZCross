import { NextRequest, NextResponse } from 'next/server';
import { globalOnrampStore } from '@/core/onramp/store';
import { OnrampOrderEvent } from '@/core/onramp/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const address = searchParams.get('address');

    let orders = globalOnrampStore.listOrders();

    if (status) {
      orders = orders.filter((o) => o.status === status.toUpperCase());
    }
    if (address) {
      orders = orders.filter((o) => o.destinationAddress.toLowerCase() === address.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      orders,
      totalCount: orders.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list Google Pay orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId = `ord_gpay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      providerId = 'google_pay_direct',
      status = 'COMPLETED',
      fiatAmount = 100,
      fiatCurrency = 'USD',
      cryptoAmount = 0.0705,
      cryptoCurrency = 'ZEC',
      destinationAddress,
      googlePayTransactionId,
      txHash,
    } = body;

    if (!destinationAddress) {
      return NextResponse.json(
        { success: false, error: 'destinationAddress is required' },
        { status: 400 }
      );
    }

    const order: OnrampOrderEvent = {
      orderId,
      providerId,
      status,
      paymentMethod: 'google_pay',
      fiatAmount: Number(fiatAmount),
      fiatCurrency,
      cryptoAmount: Number(cryptoAmount),
      cryptoCurrency,
      destinationAddress,
      googlePayTransactionId: googlePayTransactionId || `gpay_token_${Math.random().toString(36).slice(2, 10)}`,
      txHash: txHash || (status === 'COMPLETED' ? `tx_orchard_gpay_${Math.random().toString(16).slice(2, 12)}` : undefined),
      createdAt: new Date().toISOString(),
      completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined,
    };

    globalOnrampStore.saveOrder(order);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to record Google Pay order' },
      { status: 500 }
    );
  }
}
