import { NextRequest, NextResponse } from 'next/server';
import { globalOnrampStore } from '@/core/onramp/store';
import { OnrampProviderId, OnrampOrderEvent } from '@/core/onramp/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    const { searchParams } = new URL(request.url);
    const providerParam = (searchParams.get('provider') || payload.provider || 'moonpay') as OnrampProviderId;
    const signatureHeader = request.headers.get('x-webhook-signature') 
      || request.headers.get('moonpay-signature-v2')
      || request.headers.get('transak-signature')
      || undefined;

    const secret = process.env[`${providerParam.toUpperCase()}_WEBHOOK_SECRET`] || 'sandbox_secret';

    // Verify cryptographic signature
    const isValid = globalOnrampStore.verifyWebhookSignature({
      providerId: providerParam,
      payloadRaw: rawBody,
      signatureHeader,
      secret,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook cryptographic signature' },
        { status: 401 }
      );
    }

    // Extract standardized order data
    const orderId = payload.data?.id || payload.orderId || payload.id || `ord_${Date.now()}`;
    const statusRaw = (payload.data?.status || payload.status || 'COMPLETED').toUpperCase();
    
    let normalizedStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'PROCESSING';
    if (['COMPLETED', 'SETTLED', 'SUCCESS', 'DELIVERED'].includes(statusRaw)) {
      normalizedStatus = 'COMPLETED';
    } else if (['FAILED', 'CANCELLED', 'EXPIRED'].includes(statusRaw)) {
      normalizedStatus = 'FAILED';
    }

    const fiatAmount = Number(payload.data?.baseCurrencyAmount || payload.fiatAmount || payload.baseCurrencyAmount || 200);
    const fiatCurrency = (payload.data?.baseCurrencyCode || payload.fiatCurrency || 'USD').toUpperCase();
    const cryptoAmount = Number(payload.data?.quoteCurrencyAmount || payload.cryptoAmount || 0.1385);
    const destinationAddress = payload.data?.walletAddress || payload.walletAddress || payload.destinationAddress || 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6';
    const txHash = payload.data?.cryptoTransactionId || payload.txHash || `tx_orchard_onramp_${Math.random().toString(16).slice(2, 10)}`;

    const orderEvent: OnrampOrderEvent = {
      orderId,
      providerId: providerParam,
      status: normalizedStatus,
      paymentMethod: 'google_pay',
      fiatAmount,
      fiatCurrency,
      cryptoAmount,
      cryptoCurrency: 'ZEC',
      destinationAddress,
      googlePayTransactionId: payload.data?.paymentMethodDetails?.token || payload.googlePayTransactionId || `gpay_${orderId}`,
      txHash: normalizedStatus === 'COMPLETED' ? txHash : undefined,
      createdAt: payload.data?.createdAt || new Date().toISOString(),
      completedAt: normalizedStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
    };

    globalOnrampStore.saveOrder(orderEvent);

    return NextResponse.json({
      success: true,
      received: true,
      orderId,
      status: normalizedStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (orderId) {
    const order = globalOnrampStore.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  }

  const orders = globalOnrampStore.listOrders();
  return NextResponse.json({ success: true, count: orders.length, orders });
}
