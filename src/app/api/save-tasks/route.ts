import { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
import { v4 as uuid } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tasks, userId } = req.body;
    if (!tasks || !userId) {
      return res.status(400).json({ error: 'Tasks and userId are required' });
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
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, tasks: goals });
  } catch (error) {
    console.error('Error saving tasks:', error);
    res.status(500).json({ error: 'Failed to save tasks' });
  }
}
