import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * @fileOverview App-wide middleware for Next.js 15.
 * 
 * It enforces authentication on sensitive application routes by checking for 
 * the presence of a '__session' cookie. This cookie name is required by 
 * Firebase App Hosting to allow cookie headers to reach the server.
 */

export function middleware(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // The 'config.matcher' property ensures this logic only runs on protected paths.
  // If no session exists, we redirect to /auth and preserve the original destination.
  if (!session) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If session exists, allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match paths explicitly defined as protected.
     * This covers the main application features and dynamic entity routes.
     */
    '/discover/:path*',
    '/feed/:path*',
    '/fire/:path*',
    '/social/:path*',
    '/me/:path*',
    '/map/:path*',
    '/my-day/:path*',
    '/venue/:path*',
    '/creator/:path*',
    '/profile/:path*',
  ],
};
