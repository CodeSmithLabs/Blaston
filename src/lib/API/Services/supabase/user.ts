// lib/API/Services/supabase/user.ts
'use server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { cookies } from 'next/headers';
import { UserProfile } from '@/lib/types/types';

export async function getSupabaseUserSession() {
  const supabase = SupabaseServerClient();

  // Get tokens from cookies
  const access_token = cookies().get('sb-access-token')?.value;
  const refresh_token = cookies().get('sb-refresh-token')?.value;

  if (!access_token || !refresh_token) {
    console.log('No tokens found in cookies');
    return null;
  }

  // Restore session manually
  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });

  if (error) {
    console.error('Error restoring session:', error);
    return null;
  }

  return { session: data.session, user: data.session?.user };
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
  const userData = await getSupabaseUserSession();
  if (!userData) return null;
  const profile = await getUserProfile(userData.user.id);
  return { ...userData, profile };
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

export async function updateUserProfile(userId: string, updates: Partial<Omit<UserProfile, 'id'>>) {
  const supabase = SupabaseServerClient();

  const { error } = await supabase.from('user_profiles').update(updates).eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}
