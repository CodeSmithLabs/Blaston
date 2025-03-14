// lib/API/auth/cookies.ts
import { cookies } from 'next/headers';

export function clearProfileCookie() {
  cookies().delete('user-profile');
}

export function storeSessionCookies(
  session: { access_token: string; refresh_token: string },
  profile: any
) {
  // (You can still store session tokens if needed.)
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7, // 7 days,
    path: '/'
  };

  cookies().set('sb-access-token', session.access_token, cookieOptions);
  cookies().set('sb-refresh-token', session.refresh_token, cookieOptions);
  cookies().set('user-profile', JSON.stringify(profile), { ...cookieOptions, httpOnly: false });
}

export function clearSessionCookies() {
  cookies().delete('sb-access-token');
  cookies().delete('sb-refresh-token');
  clearProfileCookie();
}
