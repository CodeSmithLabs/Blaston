// lib/API/Services/supabase/tasks.ts
'use server';

import { SupabaseServerClient } from '@/lib/API/Services/init/supabase';

export const TasksAPI = {
  syncTasks: async (tasks: any[]) => {
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
  },

  manualSync: async (tasks: any[]) => {}
};
