// app/api/auth/complete-signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { storeSessionCookies } from '@/lib/API/auth/cookies';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  let access_token: string | null = null;
  let refresh_token: string | null = null;

  try {
    const body = await request.json();
    access_token = body.access_token;
    refresh_token = body.refresh_token;
  } catch {
    const cookieStore = cookies();
    access_token = cookieStore.get('sb-access-token')?.value || null;
    refresh_token = cookieStore.get('sb-refresh-token')?.value || null;
  }

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
  }

  const supabase = SupabaseServerClient();
  const { data: user, error } = await supabase.auth.getUser(access_token);
  if (error || !user?.user) {
    return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
  }

  const userId = user.user.id;
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!profile) {
    const { error: insertError } = await supabase.from('user_profiles').insert({
      id: userId,
      display_name: user.user.email.split('@')[0],
      goals: []
    });
    if (insertError) {
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }
  }

  storeSessionCookies({ access_token, refresh_token });

  return NextResponse.json({ success: true });
}
