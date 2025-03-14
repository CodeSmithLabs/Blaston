// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { ensureUserProfile } from '@/lib/API/Services/supabase/user';

export async function GET() {
  const result = await ensureUserProfile();
  if (!result) {
    return NextResponse.json({ profile: null }, { status: 401 });
  }
  return NextResponse.json({ profile: result.profile }, { status: 200 });
}
