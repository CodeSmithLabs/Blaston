import { NextResponse } from 'next/server';
import { SupabaseSignIn } from '@/lib/API/Services/supabase/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { error, data } = await SupabaseSignIn(email, password);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({
    user: data.user,
    session: data.session,
    profile: data.profile
  });
}
