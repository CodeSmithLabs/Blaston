//api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import { SupabaseSignIn } from '@/lib/API/Services/supabase/auth';
import { getUserProfile } from '@/lib/API/Services/supabase/user';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { error, data } = await SupabaseSignIn(email, password);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const profile = await getUserProfile(data.user.id);
  const profileExists = !!profile;

  return NextResponse.json({ user: data.user, session: data.session, profileExists });
}
