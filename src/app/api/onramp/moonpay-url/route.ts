import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount') || '200';
    const currency = (searchParams.get('currency') || 'USD').toLowerCase();
    const address = searchParams.get('address') || '';
    const redirectOrigin = searchParams.get('origin') || 'https://zcross.cash';

    const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY || 'pk_test_QuRBVUBMr6EnuDz228i91makUVHM6K5T';
    const secretKey = process.env.MOONPAY_SECRET_KEY;

    const url = new URL('https://buy.moonpay.com');
    url.searchParams.set('apiKey', apiKey);
    url.searchParams.set('currencyCode', 'eth');
    url.searchParams.set('baseCurrencyCode', currency);
    url.searchParams.set('baseCurrencyAmount', amount);
    url.searchParams.set('redirectURL', `${redirectOrigin}/swap?onramp_complete=1&provider=moonpay`);

    // If secret key is configured, sign the URL with wallet address
    if (secretKey && secretKey.startsWith('sk_') && address) {
      url.searchParams.set('walletAddress', address);
      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(url.search)
        .digest('base64');
      url.searchParams.set('signature', signature);
      return NextResponse.json({ url: url.toString(), signed: true });
    }

    // Without secret key, omitting walletAddress prevents MoonPay "Signature check failed" error
    return NextResponse.json({ url: url.toString(), signed: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
