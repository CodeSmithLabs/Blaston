import { NextResponse } from 'next/server';
import { SupabaseSignIn } from '@/lib/API/Services/supabase/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { error, data } = await SupabaseSignIn(email, password);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (data?.profile) {
    cookies().set('user-profile', JSON.stringify(data.profile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7
    });
  }

  return NextResponse.json({
    error: null,
    data: { user: data.user, session: data.session, profile: data.profile }
  });
}
