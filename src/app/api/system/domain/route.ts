import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3001';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const isHttps = proto === 'https' || host.includes('https');
  const isCustomDomain = !host.includes('localhost') && !host.includes('127.0.0.1');

  return NextResponse.json({
    success: true,
    data: {
      currentHost: host,
      protocol: proto,
      sslEnforced: isHttps,
      isCustomDomain,
      recommendedDnsRecords: [
        {
          type: 'A',
          name: '@',
          value: '76.76.21.21', // Vercel Anycast IP or Cloudflare
          ttl: 300,
          purpose: 'Apex domain routing',
        },
        {
          type: 'CNAME',
          name: 'www',
          value: 'cname.vercel-dns.com',
          ttl: 300,
          purpose: 'Subdomain routing',
        },
      ],
      sslRequirements: {
        webAuthnPasskeys: isHttps || host.includes('localhost'),
        googlePayWebSdk: isHttps || host.includes('localhost'),
        status: (isHttps || host.includes('localhost')) ? 'COMPLIANT' : 'REQUIRES_SSL_CERTIFICATE',
      },
    },
  });
}
