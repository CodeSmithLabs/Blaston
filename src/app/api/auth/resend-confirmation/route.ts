//api/auth/resend-confirmation
import { NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const supabase = SupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: 'Confirmation email sent' });
}
