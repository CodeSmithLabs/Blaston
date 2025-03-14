//middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authConfig from './lib/config/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;
  const profileCookie = request.cookies.get('user-profile')?.value;
  console.log('profileCookie', profileCookie);
  // If no token, redirect users trying to access /dashboard to login
  if (!token) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(authConfig.routes.login.link, request.url));
    }
    return NextResponse.next();
  }

  // If logged-in user accesses /auth/login, redirect them to the dashboard
  if (request.nextUrl.pathname === authConfig.routes.login.link) {
    return NextResponse.redirect(new URL(authConfig.redirects.toDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};
