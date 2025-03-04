// supabase/auth.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { storeSessionCookies, clearSessionCookies } from '@/lib/API/auth/cookies';

type AuthResult = {
  error: { message: string } | null;
  data: { user: any; session: any } | null;
};

export async function SupabaseSignIn(email: string, password: string): Promise<AuthResult> {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (data?.session) {
    storeSessionCookies(data.session);
  }

  return { error, data };
}

export async function SupabaseSignUp(email: string, password: string): Promise<AuthResult> {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/auth-confirm` }
  });

  return { error, data };
}

export async function SupabaseSignOut(): Promise<{ error: { message: string } | null }> {
  const supabase = SupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  clearSessionCookies();

  return { error };
}
