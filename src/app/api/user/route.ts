// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function PATCH(request: Request) {
  try {
    const user = await getSupabaseUserSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { display_name } = await request.json();
    const supabase = SupabaseServerClient();

    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({ display_name })
      .eq('id', user.user.id)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
