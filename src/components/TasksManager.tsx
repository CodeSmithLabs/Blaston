'use client';
import { useState, useEffect } from 'react';
import { TasksAPI, Goal } from '@/lib/API/Services/supabase/tasks';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';

export default function TasksManager() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    console.log('TasksAPI:', TasksAPI);
    console.log('loadGoals:', TasksAPI?.loadGoals);

    const loadData = async () => {
      const userData = await getSupabaseUserSession(true);
      if (userData) {
        setUser(userData.user);
        try {
          const goalsData = await TasksAPI.loadGoals(userData.user.id);
          setGoals(goalsData);
          setSelectedGoal(goalsData[0]?.id || '');
        } catch (error) {
          console.error('Error loading goals:', error);
        }
      }
    };
    loadData();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedGoal || !user?.id) return;

    await TasksAPI.addManualTask(selectedGoal, newTask.trim(), user.id);
    setNewTask('');
    const updatedGoals = await TasksAPI.loadGoals(user.id);
    setGoals(updatedGoals);
  };

  const handleRemoveTask = async (goalId: string, taskId: string) => {
    if (!user?.id) return;
    await TasksAPI.removeTask(goalId, taskId, user.id);
    const updatedGoals = await TasksAPI.loadGoals(user.id);
    setGoals(updatedGoals);
  };

  const handleToggleTask = async (goalId: string, taskId: string) => {
    if (!user?.id) return;
    await TasksAPI.toggleTaskCompletion(goalId, taskId, user.id);
    const updatedGoals = await TasksAPI.loadGoals(user.id);
    setGoals(updatedGoals);
  };

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
          className="text-accent-foreground px-4 py-1 rounded hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring font-serif bg-accent"
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
                  <span>{task.text}</span>
                </div>
                <button
                  onClick={() => handleRemoveTask(goal.id, task.id)}
                  className="text-destructive hover:text-destructive-foreground transition-colors"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
