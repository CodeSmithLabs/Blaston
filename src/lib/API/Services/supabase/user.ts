// lib/API/Services/supabase/user.ts
'use server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function getSupabaseUserSession() {
  const supabase = SupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) return null;
  return { session: data.session, user: data.session.user };
}

export async function getUserProfile(userId: string) {
  const supabase = SupabaseServerClient();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return profile;
}

export async function ensureUserProfile() {
  const sessionData = await getSupabaseUserSession();
  if (!sessionData) return null;
  const profile = await getUserProfile(sessionData.user.id);
  return { ...sessionData, profile };
}

export async function createUserProfile(userId: string, email: string) {
  const supabase = SupabaseServerClient();
  const { error } = await supabase.from('user_profiles').insert({
    id: userId,
    display_name: email.split('@')[0],
    goals: []
  });
  return error;
}
