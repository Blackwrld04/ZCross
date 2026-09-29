import { NextResponse } from 'next/server';
import { nearIntentsClient } from '@/core/near-intents/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const popular = await nearIntentsClient.getPopularDestinations();
    return NextResponse.json({
      success: true,
      origin: {
        symbol: 'ZEC',
        name: 'Zcash (Shielded Orchard)',
        pool: 'Orchard (Halo 2)',
        decimals: 8,
        icon: '🛡️',
        priceUsd: 1420.0,
      },
      destinations: popular,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
