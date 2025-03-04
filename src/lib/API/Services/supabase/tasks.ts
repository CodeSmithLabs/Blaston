import { SupabaseServerClient } from '../init/supabase';
import { v4 as uuid } from 'uuid';

export interface Task {
  id: string;
  goalId: string;
  text: string;
  isCompleted: boolean;
  lastCompleted?: string | null;
}

export interface Goal {
  id: string;
  name: string;
  tasks: Task[];
  created_at: string;
}

async function loadGoals(userId: string): Promise<Goal[]> {
  'use server';
  const supabase = SupabaseServerClient();
  const { data } = await supabase.from('user_profiles').select('goals').eq('id', userId).single();
  return data?.goals || [];
}

async function saveAITasks(goalsData: { goal: string; tasks: string[] }[], userId: string) {
  'use server';
  try {
    const supabase = SupabaseServerClient();
    const existingGoals = await loadGoals(userId);

    const updatedGoals = goalsData.map((goalData) => {
      const existingGoal = existingGoals.find((g) => g.name === goalData.goal);

      const goalId = existingGoal ? existingGoal.id : uuid();
      const existingTasks = existingGoal ? existingGoal.tasks : [];

      const newTasks = goalData.tasks.map((task) => ({
        id: uuid(),
        goalId,
        text: task,
        isCompleted: false,
        lastCompleted: null
      }));

      return {
        id: goalId,
        name: goalData.goal,
        tasks: [...existingTasks, ...newTasks],
        created_at: existingGoal ? existingGoal.created_at : new Date().toISOString()
      };
    });

    const { error } = await supabase
      .from('user_profiles')
      .update({ goals: updatedGoals, has_set_initial_goals: true })
      .eq('id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error saving AI tasks:', error);
    return false;
  }
}

export { loadGoals, saveAITasks };
