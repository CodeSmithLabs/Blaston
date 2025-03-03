// lib/API/Services/supabase/user.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { SupabaseAuthError } from '@/lib/utils/error';
import { cookies } from 'next/headers';

export const SupabaseSession = async () => {
  const accessToken = cookies().get('sb-access-token')?.value;
  const supabase = SupabaseServerClient();

  if (accessToken) {
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError) {
      console.log('User Error:', userError.message);
      return { session: null };
    }

    if (userData?.user) {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      return {
        session: {
          user: userData.user,
          profile: profileData
        }
      };
    }
  }

  return { session: null };
};

export const SupabaseUser = async () => {
  const supabase = SupabaseServerClient();
  const accessToken = cookies().get('sb-access-token')?.value;
  const refreshToken = cookies().get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (sessionError) {
    console.log('Session Error:', sessionError.message);
    return null;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.log('User Error:', userError?.message);
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userData.user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    ...userData.user,
    profile: profileData
  };
};
