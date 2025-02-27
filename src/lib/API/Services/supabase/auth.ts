// supabase/auth.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { cookies } from 'next/headers';

type AuthResult = {
  error: { message: string } | null;
  data: {
    user: any;
    session: any;
  } | null;
};

function storeSessionCookies(session: any) {
  const isProduction = process.env.NODE_ENV === 'production';

  cookies().set('sb-access-token', session.access_token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });

  cookies().set('sb-refresh-token', session.refresh_token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

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

export const SupabaseSignUp = async (email: string, password: string): Promise<AuthResult> => {
  const supabase = SupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/auth-confirm`
    }
  });

  if (error) {
    return { error, data: null };
  }

  return { error: null, data };
};

export const SupabaseSignOut = async (): Promise<{ error: { message: string } | null }> => {
  const supabase = SupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  // Clear cookies
  cookies().delete('sb-access-token');
  cookies().delete('sb-refresh-token');

  return { error };
};
