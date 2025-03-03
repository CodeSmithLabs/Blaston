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
      const goals: Goal[] = goalsData.map((goalData) => {
        const goalId = uuid();
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

      await supabase
        .from('user_profiles')
        .update({ goals, has_set_initial_goals: true })
        .eq('id', userId);
      return true;
    } catch (error) {
      return false;
    }
  },

  addManualTask: async (goalId: string, taskText: string, userId: string) => {
    try {
      const supabase = SupabaseServerClient();
      const goals = await TasksAPI.loadGoals(userId);
      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              tasks: [
                ...goal.tasks,
                {
                  id: uuid(),
                  goalId,
                  text: taskText,
                  isCompleted: false,
                  lastCompleted: null
                }
              ]
            }
          : goal
      );

      await supabase.from('user_profiles').update({ goals: updatedGoals }).eq('id', userId);
      return true;
    } catch (error) {
      return false;
    }
  },

  toggleTaskCompletion: async (goalId: string, taskId: string, userId: string) => {
    try {
      const supabase = SupabaseServerClient();
      const goals = await TasksAPI.loadGoals(userId);
      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              tasks: goal.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      isCompleted: !task.isCompleted,
                      lastCompleted: task.isCompleted ? null : new Date().toISOString()
                    }
                  : task
              )
            }
          : goal
      );

      await supabase.from('user_profiles').update({ goals: updatedGoals }).eq('id', userId);
      return true;
    } catch (error) {
      return false;
    }
  },

  removeTask: async (goalId: string, taskId: string, userId: string) => {
    try {
      const supabase = SupabaseServerClient();
      const goals = await TasksAPI.loadGoals(userId);
      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              tasks: goal.tasks.filter((task) => task.id !== taskId)
            }
          : goal
      );

      await supabase.from('user_profiles').update({ goals: updatedGoals }).eq('id', userId);
      return true;
    } catch (error) {
      return false;
    }
  }
};
