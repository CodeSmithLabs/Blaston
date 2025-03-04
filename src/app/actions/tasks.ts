// app/actions/tasks.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';
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

export async function loadGoals(userId: string): Promise<Goal[]> {
  const supabase = SupabaseServerClient();
  const { data } = await supabase.from('user_profiles').select('goals').eq('id', userId).single();
  return data?.goals || [];
}

export async function saveAITasks(goalsData: { goal: string; tasks: string[] }[], userId: string) {
  try {
    // Validate input
    if (!Array.isArray(goalsData)) {
      throw new Error('Invalid goalsData format');
    }

    const supabase = SupabaseServerClient();
    const existingGoals = await loadGoals(userId);

    const updatedGoals = goalsData.map((goalData) => {
      const tasksArray = Array.isArray(goalData.tasks) ? goalData.tasks : [];

      const existingGoal = existingGoals.find((g) => g.name === goalData.goal);

      const goalId = existingGoal ? existingGoal.id : uuid();
      const existingTasks = existingGoal ? existingGoal.tasks : [];

      const newTasks = tasksArray.map((task) => ({
        id: uuid(),
        goalId,
        text: typeof task === 'string' ? task : 'New task',
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

export async function addManualTask(goalId: string, taskText: string, userId: string) {
  try {
    const supabase = SupabaseServerClient();
    const goals = await loadGoals(userId);

    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        return {
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
        };
      }
      return goal;
    });

    const { error } = await supabase
      .from('user_profiles')
      .update({ goals: updatedGoals })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding manual task:', error);
    return false;
  }
}

export async function removeTask(goalId: string, taskId: string, userId: string) {
  try {
    const supabase = SupabaseServerClient();
    const goals = await loadGoals(userId);

    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.filter((task) => task.id !== taskId)
        };
      }
      return goal;
    });

    const { error } = await supabase
      .from('user_profiles')
      .update({ goals: updatedGoals })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing task:', error);
    return false;
  }
}

export async function toggleTaskCompletion(goalId: string, taskId: string, userId: string) {
  try {
    const supabase = SupabaseServerClient();
    const goals = await loadGoals(userId);

    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        return {
          ...goal,
          tasks: goal.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                isCompleted: !task.isCompleted,
                lastCompleted: task.isCompleted ? null : new Date().toISOString()
              };
            }
            return task;
          })
        };
      }
      return goal;
    });

    const { error } = await supabase
      .from('user_profiles')
      .update({ goals: updatedGoals })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    return false;
  }
}
