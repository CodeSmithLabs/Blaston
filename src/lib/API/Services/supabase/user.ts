// lib/API/Services/supabase/user.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { getSessionCookies } from '../../auth/cookies';

export async function getSupabaseUserSession(includeSession = false) {
  const { accessToken, refreshToken } = getSessionCookies();
  if (!accessToken || !refreshToken) return { session: null, user: null };

  const supabase = SupabaseServerClient();

  try {
    if (includeSession) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      if (sessionError) throw sessionError;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) throw userError || new Error('No user data');

    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      session: includeSession ? userData : null,
      user: { ...userData.user, profile: profileData }
    };
  } catch (error) {
    console.error('Supabase user session error:', error);
    return { session: null, user: null };
  }
}
