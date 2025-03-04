// lib/API/Services/supabase/user.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { getSessionCookies } from '../../auth/cookies';

export async function getSupabaseUserSession() {
  const { accessToken, refreshToken } = getSessionCookies();
  if (!accessToken || !refreshToken) return null;

  const supabase = SupabaseServerClient();

  // Set the session using tokens
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (sessionError) {
    console.error(sessionError);
    return null;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error(userError);
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();
  if (profileError) {
    console.error(profileError);
    return null;
  }

  return { session: userData, user: { ...userData.user, profile: profileData } };
}
