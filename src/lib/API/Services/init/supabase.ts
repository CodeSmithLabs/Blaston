import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const SupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const client = createClient(supabaseUrl, supabaseAnonKey);

  const token = cookies().get('sb-access-token')?.value;
  if (token) {
    client.auth.setSession({ access_token: token, refresh_token: '' });
  }

  return client;
};
