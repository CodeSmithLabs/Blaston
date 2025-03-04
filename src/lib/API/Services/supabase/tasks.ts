// lib/API/Services/supabase/tasks.ts
'use server';
import { SupabaseServerClient } from '../init/supabase';
import { v4 as uuid } from 'uuid';

export interface Task {
  id: string;
  goalId: string;
  text: string;
  isCompleted: boolean;
  lastCompleted?: string;
}

export interface Goal {
  id: string;
  name: string;
  tasks: Task[];
  created_at: string;
}

export const TasksAPI = {
  loadGoals: async (userId: string): Promise<Goal[]> => {
    const supabase = SupabaseServerClient();
    const { data } = await supabase.from('user_profiles').select('goals').eq('id', userId).single();
    return data?.goals || [];
  },

  saveAITasks: async (goalsData: { goal: string; tasks: string[] }[], userId: string) => {
    try {
      const supabase = SupabaseServerClient();
      const existingGoals = await TasksAPI.loadGoals(userId);

      // Map new AI-generated goals
      const newGoals = goalsData.map((goalData) => {
        const existingGoal = existingGoals.find((g) => g.name === goalData.goal);
        const goalId = existingGoal ? existingGoal.id : uuid();

        return {
          id: goalId,
          name: goalData.goal,
          tasks: goalData.tasks.map((task) => ({
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
        .update({ goals: newGoals, has_set_initial_goals: true })
        .eq('id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error saving AI tasks:', error);
      return false;
    }
  }
};
