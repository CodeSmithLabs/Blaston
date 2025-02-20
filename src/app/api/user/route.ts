// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { SupabaseUser } from '@/lib/API/Services/supabase/user';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

// GET: Retrieve current user
export async function GET() {
  try {
    const user = await SupabaseUser();
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('GET /api/user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update user's display name
export async function PATCH(request: Request) {
  try {
    const user = await SupabaseUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { display_name } = await request.json();
    const supabase = SupabaseServerClient();

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ display_name })
      .eq('id', user.id)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    console.error('PATCH /api/user error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
