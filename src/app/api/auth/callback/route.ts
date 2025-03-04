//api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { storeSessionCookies } from '@/lib/API/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token } = await request.json();
    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    storeSessionCookies({ access_token, refresh_token });

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
      await supabase.from('user_profiles').insert({
        id: userId,
        display_name: user.user.email.split('@')[0],
        goals: []
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
