'use server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { SupabaseAuthError } from '@/lib/utils/error';

export const SupabaseSession = async () => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) SupabaseAuthError(error);
  return data;
};

export const SupabaseUser = async () => {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) SupabaseAuthError(error);
  return data?.user;
};
