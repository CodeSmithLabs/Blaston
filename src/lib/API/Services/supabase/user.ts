// user.ts
'use server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { SupabaseAuthError } from '@/lib/utils/error';
import { cookies } from 'next/headers';

export const SupabaseSession = async () => {
  const accessToken = cookies().get('sb-access-token')?.value;
  const refreshToken = cookies().get('sb-refresh-token')?.value;
  const supabase = SupabaseServerClient();

  // Check for Access Token
  if (accessToken) {
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError) {
      console.log('User Error:', userError.message);

      // If token is expired, try to refresh it
      if (userError.message.includes('token is expired') && refreshToken) {
        console.log('Access token expired, attempting refresh...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken
        });

        if (refreshError) {
          console.log('Refresh Error:', refreshError.message);
          return { session: null };
        }

        // Store the new tokens in cookies
        cookies().set('sb-access-token', refreshData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        });

        cookies().set('sb-refresh-token', refreshData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        });

        return {
          session: {
            user: refreshData.user
          }
        };
      }
    }

    // Return session if token is valid
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
