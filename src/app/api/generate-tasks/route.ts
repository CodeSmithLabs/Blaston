//api/generate-tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateTasks } from '@/lib/togetherClient';

export async function POST(req: NextRequest) {
  try {
    const { goals } = await req.json();
    if (!goals || !Array.isArray(goals)) {
      return NextResponse.json({ error: 'Goals array is required' }, { status: 400 });
    }

    const tasks = await Promise.all(
      goals.map(async (goal: string) => {
        const prompt = `Given the goal: "${goal}", generate three structured daily tasks to achieve it.`;

        try {
          const response = await generateTasks([{ role: 'system', content: prompt }]);

          return {
            goal,
            tasks:
              response
                .split('\n')
                .filter((t: string) => t.trim())
                .slice(0, 3)
                .map((t: string) => t.replace(/^\d+\.\s*/, '').trim()) || []
          };
        } catch (error) {
          console.error(`Error generating tasks for goal "${goal}":`, error);
          return { goal, tasks: [] };
        }
      })
    );
    console.log('Generated tasks:', tasks);
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/generate-tasks:', error);
    return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 });
  }
}
