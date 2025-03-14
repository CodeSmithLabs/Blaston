// components/TasksManager.tsx
'use client';

import { useState } from 'react';
import { addManualTask, removeTask, toggleTaskCompletion } from '@/app/actions/tasks';
import { Trash2Icon } from 'lucide-react';
import { useUserProfile } from '@/context/UserProfileContext';

export default function TasksManager() {
  const { userProfile, updateProfileField } = useUserProfile();
  const [newTask, setNewTask] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(userProfile?.goals[0]?.id || '');
  const [error, setError] = useState<string | null>(null);

  if (!userProfile) {
    return <div className="py-4 lg:px-16">Loading user profile...</div>;
  }

  const { id: userId, goals } = userProfile;

  const updateGoalsLocally = (updatedGoals) => {
    updateProfileField('goals', updatedGoals);
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedGoal) return;

    try {
      setError(null);
      await addManualTask(selectedGoal, newTask.trim(), userId);

      const updatedGoals = goals.map((goal) =>
        goal.id === selectedGoal
          ? {
              ...goal,
              tasks: [
                ...goal.tasks,
                { id: crypto.randomUUID(), text: newTask.trim(), isCompleted: false }
              ]
            }
          : goal
      );

      updateGoalsLocally(updatedGoals);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleRemoveTask = async (goalId: string, taskId: string) => {
    try {
      setError(null);
      await removeTask(goalId, taskId, userId);

      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, tasks: goal.tasks.filter((task) => task.id !== taskId) }
          : goal
      );

      updateGoalsLocally(updatedGoals);
    } catch (error) {
      console.error('Error removing task:', error);
      setError('Failed to remove task. Please try again.');
    }
  };

  const handleToggleTask = async (goalId: string, taskId: string) => {
    try {
      setError(null);
      await toggleTaskCompletion(goalId, taskId, userId);

      const updatedGoals = goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              tasks: goal.tasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
              )
            }
          : goal
      );

      updateGoalsLocally(updatedGoals);
    } catch (error) {
      console.error('Error toggling task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  return (
    <div className="text-card-foreground relative">
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

      <div className="flex flex-col sm:flex-row gap-2 mt-4 z-5">
        <select
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          className="border border-border bg-input text-foreground px-2 py-2 rounded w-full sm:w-auto"
        >
          {goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>

        <input
          className="border border-border bg-input text-foreground px-2 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />

        <button
          onClick={handleAddTask}
          disabled={!newTask.trim()}
          className="bg-accent-primary text-accent-foreground px-4 py-2 rounded hover:bg-accent-primary-hover transition-colors hover:shadow-md hover:transform hover:scale-105 border border-accent-foreground w-full sm:w-auto"
        >
          Add Task
        </button>
      </div>

      {error && (
        <div className="py-4 lg:px-16 text-red-500">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-blue-500 hover:underline">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
