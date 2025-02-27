import { NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function POST(request: Request) {
  try {
    const { tasks, userId } = await request.json();
    const supabase = SupabaseServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ goals: tasks })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, tasks: data[0]?.goals || [] });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
