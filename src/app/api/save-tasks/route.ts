// app/api/save-tasks/route.ts
import { NextResponse } from 'next/server';
import { TasksAPI } from '@/lib/API/Services/supabase/tasks';

export async function POST(request: Request) {
  try {
    const { tasks, userId } = await request.json();

    if (!tasks || !userId) {
      return NextResponse.json({ error: 'Tasks and userId are required' }, { status: 400 });
    }

    const success = await TasksAPI.saveAITasks(tasks, userId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 });
    }

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error('Error saving tasks:', error);
    return NextResponse.json({ error: 'Failed to save tasks' }, { status: 500 });
  }
}
