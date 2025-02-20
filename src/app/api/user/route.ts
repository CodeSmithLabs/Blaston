// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { SupabaseUser } from '@/lib/API/Services/supabase/user';

export async function GET() {
  try {
    const user = await SupabaseUser();
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
