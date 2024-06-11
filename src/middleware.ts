import { NextRequest, NextResponse } from 'next/server';
import { appRoutes } from './shared/constants';
import { isUserAuthenticated } from './helpers/auth';

export async function middleware(request: NextRequest) {
  const isAuthenticated = await isUserAuthenticated();

  if (!isAuthenticated) {
    const nextUrl = new URL(appRoutes.login, request.nextUrl.origin);
    return NextResponse.redirect(nextUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!login|_next/static|_next/image|favicon.ico).*)',
  ],
};
