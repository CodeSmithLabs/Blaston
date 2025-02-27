import { NextResponse } from 'next/server';
import { SupabaseSignIn } from '@/lib/API/Services/supabase/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Call the server function on the server side
    const { data, error } = await SupabaseSignIn(email, password);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // If successful, return success + user data
    return NextResponse.json({ success: true, user: data?.user });
  } catch (err: any) {
    console.error('Sign in error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
