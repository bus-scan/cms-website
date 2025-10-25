import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the access token from HTTP-only cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/user-invitation'];
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/user'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // If user is on root page
  if (pathname === '/') {
    if (accessToken) {
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    } else {
      // User is not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // If user is trying to access a protected route without authentication
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and trying to access login page, redirect to dashboard
  if (pathname === '/login' && accessToken) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
