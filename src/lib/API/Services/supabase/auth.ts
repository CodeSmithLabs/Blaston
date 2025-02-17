// supabase/auth.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { cookies } from 'next/headers';

type SignInResult = {
  error: { message: string } | null;
  data: {
    user: any;
    session: any;
  } | null;
};

export const SupabaseSignIn = async (email: string, password: string): Promise<SignInResult> => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error, data: null };
  }

  if (data.session) {
    const isProduction = process.env.NODE_ENV === 'production';
    cookies().set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: isProduction, // Only secure if in production
      maxAge: 60 * 60 * 24 * 7,
      path: '/dashboard'
    });

    cookies().set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
  }

  return { error: null, data };
};
