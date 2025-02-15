// components/TasksManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

interface Task {
  id: string;
  goal: string;
  isCompleted: boolean;
  lastCompletedDate?: string;
}

export default function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newGoal, setNewGoal] = useState('');

  // 1. Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('lockedin-tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // 2. Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('lockedin-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 3. Sync with Supabase (async) - call this in intervals or on changes
  useEffect(() => {
    const syncToSupabase = async () => {
      // Example: POST to your API route
      try {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tasks })
        });
      } catch (error) {
        console.error('Supabase sync error:', error);
      }
    };
    // For MVP, we can call sync on every tasks update or at intervals
    syncToSupabase();
  }, [tasks]);

  // 4. Create a new task/goal
  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    const newTask: Task = {
      id: uuid(),
      goal: newGoal.trim(),
      isCompleted: false,
      lastCompletedDate: ''
    };
    setTasks((prev) => [...prev, newTask]);
    setNewGoal('');
  };

  // 5. Toggle completion, reset daily at midnight logic
  const toggleCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const today = new Date().toDateString();
          const alreadyCompletedToday = t.lastCompletedDate === today;
          return {
            ...t,
            isCompleted: !alreadyCompletedToday,
            lastCompletedDate: !alreadyCompletedToday ? today : ''
          };
        }
        return t;
      })
    );
  };

  // 6. Edit an existing goal
  const editGoal = (id: string, updatedGoal: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, goal: updatedGoal } : t)));
  };

  // 7. Remove a goal
  const removeGoal = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-300 px-2 py-1 rounded w-full"
          placeholder="Enter a goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button onClick={handleAddGoal} className="bg-lockedin-purple text-white px-4 py-1 rounded">
          Add Goal
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-3 rounded flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleCompletion(task.id)}
              />
              <EditableGoal goal={task.goal} onSave={(val) => editGoal(task.id, val)} />
            </div>
            <button onClick={() => removeGoal(task.id)} className="text-red-500 hover:text-red-700">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Inline component for editing goal text
function EditableGoal({ goal, onSave }: { goal: string; onSave: (val: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(goal);

  const handleSave = () => {
    onSave(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        className="border-b border-gray-300 focus:outline-none bg-transparent"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className="cursor-pointer">
      {goal}
    </span>
  );
}
