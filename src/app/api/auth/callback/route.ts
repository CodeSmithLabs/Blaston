import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function POST(request: Request) {
  const { access_token, refresh_token } = await request.json();
  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
  }

  const isProduction = process.env.NODE_ENV === 'production';

  cookies().set('sb-access-token', access_token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  cookies().set('sb-refresh-token', refresh_token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  const supabase = SupabaseServerClient();
  const { data: user, error } = await supabase.auth.getUser(access_token);

  if (error || !user?.user) {
    return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.user.id)
    .single();

  if (!profile) {
    await supabase.from('user_profiles').insert({
      id: user.user.id,
      display_name: user.user.email.split('@')[0],
      goals: []
    });
  }

  return NextResponse.json({ success: true });
}
