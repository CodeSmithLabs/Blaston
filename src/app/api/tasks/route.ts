import { NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export async function POST(request: Request) {
  try {
    const { tasks } = await request.json();
    const supabase = SupabaseServerClient();

    const { data, error } = await supabase.from('goals').upsert(tasks, { onConflict: 'id' });
    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
