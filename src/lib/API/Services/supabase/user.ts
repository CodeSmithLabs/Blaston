// user.ts
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
      return {
        session: {
          user: userData.user
        }
      };
    }
  }

  return { session: null };
};

export const SupabaseUser = async () => {
  const supabase = SupabaseServerClient();
  const token = cookies().get('sb-access-token')?.value;

  if (token) {
    await supabase.auth.setSession({ access_token: token, refresh_token: '' });
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) SupabaseAuthError(error);

  return data?.user;
};
