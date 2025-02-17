// supabase/auth.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { cookies } from 'next/headers';

// A single type covering both sign-in and sign-up results
type AuthResult = {
  error: { message: string } | null;
  data: {
    user: any;
    session: any;
  } | null;
};

// DRY helper to set session cookies
function storeSessionCookies(session: any) {
  const isProduction = process.env.NODE_ENV === 'production';

  cookies().set('sb-access-token', session.access_token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/dashboard'
  });

  cookies().set('sb-refresh-token', session.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

// Sign in with email/password
export const SupabaseSignIn = async (email: string, password: string): Promise<AuthResult> => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error, data: null };
  }

  if (data.session) {
    storeSessionCookies(data.session);
  }

  return { error: null, data };
};

// Sign up with email/password and auto-login if successful
export const SupabaseSignUp = async (email: string, password: string): Promise<AuthResult> => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error, data: null };
  }

  // If Supabase returns a session, store cookies to log user in
  if (data.session) {
    storeSessionCookies(data.session);
  }

  return { error: null, data };
};
