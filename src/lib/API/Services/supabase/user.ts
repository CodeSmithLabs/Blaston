// lib/API/Services/supabase/user.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
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

interface UserProfile {
  id: string;
  has_set_initial_goals: boolean;
  goals?: any[];
}

export const SupabaseUser = async () => {
  const supabase = SupabaseServerClient();
  const accessToken = cookies().get('sb-access-token')?.value;
  const refreshToken = cookies().get('sb-refresh-token')?.value;

  if (!accessToken || !refreshToken) return null;

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

    return {
      ...userData.user,
      profile: profileData as UserProfile
    };
  } catch (error) {
    console.error('Supabase user error:', error);
    return null;
  }
};
