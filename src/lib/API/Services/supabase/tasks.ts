// lib/API/Services/supabase/tasks.ts
'use client'; // because we need localStorage and setTimeout in the browser

export interface Task {
  id: string;
  goal: string;
  isCompleted: boolean;
  lastCompletedDate?: string;
}

function resetTasks(tasks: Task[]): Task[] {
  return tasks.map((t) => ({
    ...t,
    isCompleted: false,
    lastCompletedDate: ''
  }));
}

export const TasksAPI = {
  loadTasks: (): Task[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('lockedin-tasks');
    return stored ? JSON.parse(stored) : [];
  },

  saveTasks: (tasks: Task[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('lockedin-tasks', JSON.stringify(tasks));
  },

  scheduleMidnightReset: (setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
    function schedule() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);

      // If it's already past midnight, move to the next day
      if (midnight <= now) {
        midnight.setDate(midnight.getDate() + 1);
      }

      const timeToMidnight = midnight.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        setTasks((prev) => {
          const reset = resetTasks(prev);
          TasksAPI.saveTasks(reset);
          TasksAPI.syncTasks(reset);
          return reset;
        });
        schedule();
      }, timeToMidnight);

      return timeoutId;
    }

    const timeoutId = schedule();
    return () => clearTimeout(timeoutId);
  },

  syncTasks: async (tasks: Task[]) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      return await response.json();
    } catch (error) {
      console.error('Sync error:', error);
      return { error: 'Sync failed' };
    }
  }
};
