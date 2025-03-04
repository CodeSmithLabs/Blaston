// components/TasksManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';
import {
  loadGoals,
  addManualTask,
  removeTask,
  toggleTaskCompletion,
  Goal
} from '@/app/actions/tasks';
import { Trash2Icon } from 'lucide-react';

export default function TasksManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user and goals on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getSupabaseUserSession(true);
        if (!userData?.user) throw new Error('User session not found');

        setUser(userData.user);
        const goalsData = await loadGoals(userData.user.id);
        setGoals(goalsData);
        setSelectedGoal(goalsData[0]?.id || '');
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedGoal || !user?.id) return;

    try {
      setError(null);
      await addManualTask(selectedGoal, newTask.trim(), user.id);

      // Refresh goals
      const updatedGoals = await loadGoals(user.id);
      setGoals(updatedGoals);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleRemoveTask = async (goalId: string, taskId: string) => {
    if (!user?.id) return;

    try {
      setError(null);
      await removeTask(goalId, taskId, user.id);

      // Refresh goals
      const updatedGoals = await loadGoals(user.id);
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error removing task:', error);
      setError('Failed to remove task. Please try again.');
    }
  };

  const handleToggleTask = async (goalId: string, taskId: string) => {
    if (!user?.id) return;

    try {
      setError(null);
      await toggleTaskCompletion(goalId, taskId, user.id);

      // Refresh goals
      const updatedGoals = await loadGoals(user.id);
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  if (loading) {
    return <div className="py-4 lg:px-16">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="py-4 lg:px-16 text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 text-blue-500 hover:underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="text-card-foreground relative">
      <div className="flex gap-2 mb-4 z-5">
        <select
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          className="border border-border bg-input text-foreground px-2 py-1 rounded"
        >
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>

        <input
          className="border border-border bg-input text-foreground px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />

        <button
          onClick={handleAddTask}
          disabled={!newTask.trim()}
          className="bg-accent-primary text-accent-foreground px-4 py-1 rounded hover:bg-accent-primary-hover transition-colors hover:shadow-md hover:transform hover:scale-105 border border-accent-foreground"
        >
          Add Task
        </button>
      </div>

      {goals.map((goal) => (
        <div key={goal.id} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{goal.name}</h3>
          <ul className="space-y-2">
            {goal.tasks.map((task) => (
              <li
                key={task.id}
                className="border border-border p-3 rounded flex justify-between items-center bg-card text-foreground"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggleTask(goal.id, task.id)}
                    className="accent-primary"
                  />
                  <span className={task.isCompleted ? 'line-through opacity-75' : ''}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTask(goal.id, task.id)}
                  className="text-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2Icon size={20} className="hover:transform hover:scale-110" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
