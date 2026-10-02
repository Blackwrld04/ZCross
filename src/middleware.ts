import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const proto = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host') || '';

  // 1. Enforce HTTPS in production environments
  if (process.env.NODE_ENV === 'production' && proto === 'http' && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // 2. Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, Idempotency-Key');
      response.headers.set('Access-Control-Max-Age', '86400');
      return response;
    }
  }

  const response = NextResponse.next();

  // Attach standard security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
