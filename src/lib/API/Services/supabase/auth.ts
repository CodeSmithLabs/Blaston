'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { cookies } from 'next/headers';

type SignInResult = {
  error: { message: string } | null;
  data: {
    user: any;
    session: any;
    weakPassword?: unknown;
  } | null;
};

export const SupabaseSignIn = async (email: string, password: string): Promise<SignInResult> => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error, data: null };
  }

  if (data.session) {
    cookies().set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    cookies().set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
  }

  return { error: null, data };
};

type SignUpResult = {
  error: { message: string } | null;
  data: {
    user: any;
    session: any;
  } | null;
};

export const SupabaseSignUp = async (email: string, password: string): Promise<SignUpResult> => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return { error, data: null };
  }

  if (data.session) {
    cookies().set('sb-access-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    cookies().set('sb-refresh-token', data.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
  }

  return { error: null, data };
};
