// lib/API/Services/supabase/user.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { getSessionCookies } from '../../auth/cookies';

export async function SupabaseSession() {
  const { accessToken } = getSessionCookies();
  if (!accessToken) return { session: null };

  const supabase = SupabaseServerClient();
  const { data: userData, error } = await supabase.auth.getUser(accessToken);

  if (error || !userData?.user) return { session: null };

  const { data: profileData } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  return { session: { user: userData.user, profile: profileData } };
}

export async function SupabaseUser() {
  const { accessToken, refreshToken } = getSessionCookies();
  if (!accessToken || !refreshToken) return null;

  const supabase = SupabaseServerClient();

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (sessionError) throw sessionError;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) throw userError || new Error('No user data');

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError) throw profileError;

    return { ...userData.user, profile: profileData };
  } catch (error) {
    console.error('Supabase user error:', error);
    return null;
  }
}
