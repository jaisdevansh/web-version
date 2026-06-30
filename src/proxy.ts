import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/dashboard',
  '/settings',
  '/profile',
  '/orders',
  '/payments',
  '/booking',
  '/account'
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Look for the auth token cookie
    const token = request.cookies.get('party_auth_token')?.value;
    
    if (!token) {
      // Redirect to login if unauthenticated
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Add security headers to the response (Defense in Depth)
  const response = NextResponse.next();
  
  // HSTS (Strict-Transport-Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    // Apply middleware to all routes except api, _next/static, _next/image, and favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
