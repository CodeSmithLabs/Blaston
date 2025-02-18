// components/TasksManager.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { TasksAPI } from '@/lib/API/Services/supabase/tasks';

interface Task {
  id: string;
  goal: string;
  isCompleted: boolean;
  lastCompletedDate?: string;
}

export default function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('lockedin-tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lockedin-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Schedule a reset + sync at midnight local time
  useEffect(() => {
    function scheduleMidnightReset() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      if (midnight <= now) {
        midnight.setDate(midnight.getDate() + 1);
      }

      const timeToMidnight = midnight.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        setTasks((prev) => {
          const resetTasks = prev.map((t) => ({
            ...t,
            isCompleted: false,
            lastCompletedDate: ''
          }));
          localStorage.setItem('lockedin-tasks', JSON.stringify(resetTasks));
          TasksAPI.syncTasks(resetTasks);
          return resetTasks;
        });
        scheduleMidnightReset();
      }, timeToMidnight);

      return () => clearTimeout(timeoutId);
    }

    scheduleMidnightReset();
  }, []);

  const handleAddGoal = useCallback(() => {
    if (!newGoal.trim()) return;
    const newTask: Task = {
      id: uuid(),
      goal: newGoal.trim(),
      isCompleted: false,
      lastCompletedDate: ''
    };
    setTasks((prev) => [...prev, newTask]);
    setNewGoal('');
  }, [newGoal]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddGoal();
  };

  const toggleCompletion = useCallback((id: string) => {
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
  }, []);

  const editGoal = useCallback((id: string, updatedGoal: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, goal: updatedGoal } : t)));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          className="border border-gray-300 px-2 py-1 rounded w-full"
          placeholder="Enter a goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleAddGoal}
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
        >
          Add Goal
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-3 rounded flex justify-between items-center bg-white"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleCompletion(task.id)}
                className="accent-purple-600"
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

function EditableGoal({ goal, onSave }: { goal: string; onSave: (val: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(goal);

  const handleSave = () => {
    onSave(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
  };

  if (editing) {
    return (
      <input
        className="border-b border-gray-300 focus:outline-none bg-transparent text-black"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer text-black hover:text-purple-600"
    >
      {goal}
    </span>
  );
}
