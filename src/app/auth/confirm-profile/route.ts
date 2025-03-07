// app/api/auth/ensure-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function GET(request: NextRequest) {
  const supabase = SupabaseServerClient();
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error || !sessionData?.session) {
    return NextResponse.json({ profileExists: false });
  }

  const userId = sessionData.session.user.id;
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .single();

  return NextResponse.json({ profileExists: !!profile });
}
