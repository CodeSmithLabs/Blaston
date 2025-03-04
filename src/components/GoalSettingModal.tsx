'use client';

import { useEffect, useState } from 'react';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';
import { saveAITasks } from '@/lib/API/Services/supabase/tasks';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalSettingModal = ({ isOpen, onClose }: GoalSettingModalProps) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getSupabaseUserSession(true);
        if (!userData?.user) throw new Error('User session not found');
        setUser(userData.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load user session.');
      }
    };
    fetchUser();
  }, []);

  const handleFinalizeGoals = async () => {
    if (goals.length !== 3 || !user?.id) return;

    setIsGenerating(true);
    setError(null);

    try {
      const taskResponse = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals })
      });

      if (!taskResponse.ok) throw new Error(`Task generation failed: ${taskResponse.status}`);

      const { tasks } = await taskResponse.json();
      if (!tasks) throw new Error('No tasks returned from AI generation.');

      const goalsData = goals.map((goal, index) => ({
        goal,
        tasks: tasks[index] || []
      }));

      const success = await saveAITasks(goalsData, user.id);
      if (!success) throw new Error('Failed to save tasks');

      onClose();
    } catch (error) {
      console.error('Task processing error:', error);
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddGoal = () => {
    if (goals.length >= 3 || !currentGoal.trim()) return;
    setGoals((prev) => [...prev, currentGoal.trim()]);
    setCurrentGoal('');
  };

  const handleRemoveGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Set Your 3 Goals</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span className="text-sm">{goal}</span>
              <button
                className="text-red-500 text-xs font-semibold"
                onClick={() => handleRemoveGoal(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {goals.length < 3 && (
          <div className="flex mt-2">
            <input
              type="text"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              className="border p-2 flex-1 rounded-l"
              placeholder="Enter a goal"
            />
            <button
              onClick={handleAddGoal}
              className="bg-blue-500 text-white px-3 rounded-r"
              disabled={!currentGoal.trim()}
            >
              Add
            </button>
          </div>
        )}

        <button
          onClick={handleFinalizeGoals}
          className={`mt-4 w-full p-2 rounded ${
            goals.length === 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
          }`}
          disabled={goals.length !== 3 || isGenerating}
        >
          {isGenerating ? 'Saving...' : 'Finalize'}
        </button>

        <button onClick={onClose} className="mt-2 w-full text-center text-sm text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
};
