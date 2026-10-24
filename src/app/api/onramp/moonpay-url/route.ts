import { NextRequest, NextResponse } from 'next/server';
import { MoonPay } from '@moonpay/moonpay-node';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount') || '200';
    const currency = (searchParams.get('currency') || 'USD').toLowerCase();
    const address = searchParams.get('address') || '';
    const redirectOrigin = searchParams.get('origin') || 'https://zcross.cash';

    const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY || 'pk_test_QuRBVUBMr6EnuDz228i91makUVHM6K5T';
    const secretKey = process.env.MOONPAY_SECRET_KEY || 'sk_test_3p9oytQZnZs5oIe1iJFmHSfVCJ4Bcz';

    const url = new URL('https://buy.moonpay.com');
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('currencyCode', 'eth');
    url.searchParams.set('baseCurrencyCode', currency);
    url.searchParams.set('baseCurrencyAmount', amount);
    url.searchParams.set('redirectURL', `${redirectOrigin}/swap?onramp_complete=1&provider=moonpay`);

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '';

    if (clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1') {
      url.searchParams.set('allowedIpAddress', clientIp);
    }

    if (address && address.startsWith('0x')) {
      url.searchParams.set('walletAddress', address);
    }

    if (secretKey && secretKey.startsWith('sk_')) {
      try {
        const moonpay = new MoonPay(secretKey);
        const signedUrl = moonpay.url.generateSignature(url.toString(), { returnFullUrl: true });
        if (signedUrl) {
          return NextResponse.json({ url: signedUrl, signed: true });
        }
      } catch (err) {
        console.error('MoonPay signature error:', err);
      }
    }

    return NextResponse.json({ url: url.toString(), signed: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
