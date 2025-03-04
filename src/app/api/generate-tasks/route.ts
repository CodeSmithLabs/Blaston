// api/generate-tasks/route.ts
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
        const prompt = `For the goal: "${goal}", generate exactly 3 structured daily tasks as a plain list, without any headings or descriptions, just numbered tasks. Example format: "1. Task One\n2. Task Two\n3. Task Three".`;

        try {
          const response = await generateTasks([{ role: 'system', content: prompt }]);

          // Extract and format tasks
          const extractedTasks = response
            .split('\n')
            .map((task) => task.replace(/^\d+\.\s*/, '').trim())
            .filter((task) => task)
            .slice(0, 3);

          return extractedTasks;
        } catch (error) {
          console.error(`Error generating tasks for goal "${goal}":`, error);
          return []; // Return empty array if generation fails
        }
      })
    );

    // Return tasks in the format: { tasks: string[][] }
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/generate-tasks:', error);
    return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 });
  }
}
