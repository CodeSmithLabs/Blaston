// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ensureUserProfile } from './lib/API/Services/supabase/user';
import authConfig from './lib/config/auth';

export async function middleware(request: NextRequest) {
  const session = await ensureUserProfile();

  // If no session, unauthenticated users accessing /dashboard redirect to login
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL(authConfig.routes.login.link, request.url));
    }
    return NextResponse.next();
  }

  // If session exists but no profile, redirect to complete-signup page
  if (!session.profile && request.nextUrl.pathname !== authConfig.routes.completeSignup.link) {
    return NextResponse.redirect(new URL(authConfig.routes.completeSignup.link, request.url));
  }

  // Redirect logged-in users away from /auth/login to dashboard
  if (request.nextUrl.pathname === authConfig.routes.login.link) {
    return NextResponse.redirect(new URL(authConfig.redirects.toDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};
