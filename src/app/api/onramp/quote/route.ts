import { NextRequest, NextResponse } from 'next/server';
import { 
  calculateOnrampQuotes, 
  FiatCurrency 
} from '@/core/onramp/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amountStr = searchParams.get('amount') || '200';
    const currency = (searchParams.get('currency') || 'USD') as FiatCurrency;
    const address = searchParams.get('address') || 'u1q56a7066c5a4dd7777873a6d64ab0711036bcb9fd824eb8166d5b5aa61993425f385bb2da562ba0b1f6';

    const fiatAmount = parseFloat(amountStr) || 200;

    const quotes = calculateOnrampQuotes({
      fiatAmount,
      fiatCurrency: currency,
      destinationAddress: address,
      paymentNetwork: 'google_pay',
    });

    return NextResponse.json({
      success: true,
      paymentMethod: 'google_pay',
      timestamp: new Date().toISOString(),
      fiatAmount,
      fiatCurrency: currency,
      destinationAddress: address,
      quotes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to calculate Google Pay quotes' },
      { status: 500 }
    );
  }
}
