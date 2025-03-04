// lib/auth/cookies.ts
import { cookies } from 'next/headers';

const isProduction = process.env.NODE_ENV === 'production';

export function storeSessionCookies(session: { access_token: string; refresh_token: string }) {
  if (!session?.access_token || !session?.refresh_token) return;

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  };

  cookies().set('sb-access-token', session.access_token, cookieOptions);
  cookies().set('sb-refresh-token', session.refresh_token, cookieOptions);
}

export function getSessionCookies() {
  return {
    accessToken: cookies().get('sb-access-token')?.value || null,
    refreshToken: cookies().get('sb-refresh-token')?.value || null
  };
}

export function clearSessionCookies() {
  cookies().delete('sb-access-token');
  cookies().delete('sb-refresh-token');
}
