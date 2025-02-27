// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { SupabaseSignUp } from '@/lib/API/Services/supabase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const { data, error } = await SupabaseSignUp(email, password);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data?.user });
  } catch (err: any) {
    console.error('Sign up error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
