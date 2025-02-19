// components/TasksManager.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { TasksAPI, Task } from '@/lib/API/Services/supabase/tasks';

export default function TasksManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    const loaded = TasksAPI.loadTasks();
    setTasks(loaded);
  }, []);

  useEffect(() => {
    TasksAPI.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const cleanup = TasksAPI.scheduleMidnightReset(setTasks);
    return cleanup;
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
    <div className="bg-card text-card-foreground relative p-4">
      <div className="flex gap-2 mb-4 z-5">
        <input
          className="border border-border bg-input text-foreground px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter a goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleAddGoal}
          className="bg-primary text-primary-foreground px-4 py-1 rounded hover:bg-primary/90 transition-colors"
        >
          Add Goal
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border border-border p-3 rounded flex justify-between items-center bg-card text-foreground"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleCompletion(task.id)}
                className="accent-primary"
              />
              <EditableGoal goal={task.goal} onSave={(val) => editGoal(task.id, val)} />
            </div>
            <button
              onClick={() => removeGoal(task.id)}
              className="text-destructive hover:text-destructive-foreground transition-colors"
            >
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
        className="border-b border-border focus:outline-none bg-transparent text-foreground"
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
      className="cursor-pointer text-foreground hover:text-primary transition-colors"
    >
      {goal}
    </span>
  );
}
