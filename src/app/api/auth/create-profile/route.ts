import { NextResponse } from 'next/server';
import { createUserProfile } from '@/lib/API/Services/supabase/user';

export async function POST(request: Request) {
  const { userId, email } = await request.json();

  const error = await createUserProfile(userId, email);
  if (error) {
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
