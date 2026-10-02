import { NextResponse } from 'next/server';
import { googlePayService } from '@/core/onramp/google-pay-production';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = googlePayService.getConfig();
    return NextResponse.json({
      success: true,
      data: config,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve Google Pay configuration',
      },
      { status: 500 }
    );
  }
}
