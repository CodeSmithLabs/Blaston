'use server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import config from '@/lib/config/auth';
import { SupabaseAuthError } from '@/lib/utils/error';

export const SupabaseSignUp = async (email: string, password: string) => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseSignIn = async (email: string, password: string) => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseSignOut = async () => {
  const supabase = SupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) SupabaseAuthError(error);
  return true;
};

export const SupabaseSignInWithGoogle = async () => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  });
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseSignInWithMagicLink = async (email: string) => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: `${email}`,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}${config.redirects.callback}`
    }
  });
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseUpdateEmail = async (email: string) => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.updateUser({ email });
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseUpdatePassword = async (password: string) => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseResetPasswordEmail = async (email: string) => {
  const supabase = SupabaseServerClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_DOMAIN}${config.redirects.toProfile}`;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  });
  if (error) SupabaseAuthError(error);
  return data;
};
