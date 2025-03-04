// app/api/save-tasks/route.ts
import { NextResponse } from 'next/server';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  try {
    const { tasks, userId } = await request.json();

    if (!tasks || !userId) {
      return NextResponse.json({ error: 'Tasks and userId are required' }, { status: 400 });
    }

    const supabase = SupabaseServerClient();

    const goals = tasks.map((taskData: { goal: string; tasks: string[] }) => {
      const goalId = uuid();
      return {
        id: goalId,
        name: taskData.goal,
        tasks: taskData.tasks.map((task) => ({
          id: uuid(),
          goalId,
          text: task,
          isCompleted: false,
          lastCompleted: null
        })),
        created_at: new Date().toISOString()
      };
    });

    const { error } = await supabase
      .from('user_profiles')
      .update({ goals, has_set_initial_goals: true })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, tasks: goals });
  } catch (error) {
    console.error('Error saving tasks:', error);
    return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 });
  }
}
