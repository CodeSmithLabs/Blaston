// src/components/GoalSettingModal.tsx
'use client';

import { useState } from 'react';
import { saveAITasks } from '@/app/actions/tasks';
import { TrashIcon } from 'lucide-react';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
}

export const GoalSettingModal = ({ isOpen, onClose, userProfile }: GoalSettingModalProps) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinalizeGoals = async () => {
    if (goals.length !== 3 || !userProfile?.id) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Call the API to generate tasks
      const taskResponse = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals })
      });

      if (!taskResponse.ok) throw new Error(`Task generation failed: ${taskResponse.status}`);

      const { tasks } = await taskResponse.json();
      if (!tasks || !Array.isArray(tasks))
        throw new Error('Invalid tasks data returned from AI generation.');

      // Prepare goals data for saving
      const goalsData = goals.map((goal, index) => ({
        goal,
        tasks: Array.isArray(tasks[index]) ? tasks[index] : []
      }));

      // Save tasks to Supabase (this also updates the session cookie)
      const success = await saveAITasks(goalsData, userProfile.id);
      if (!success) throw new Error('Failed to save tasks');

      onClose();
    } catch (error: any) {
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
            <div key={index} className="flex items-center">
              <div className="flex-1 text-lockedin-purple">{goal}</div>
              <button onClick={() => handleRemoveGoal(index)} className="text-red-500">
                <TrashIcon size={16} />
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
              className="bg-lockedin-purple text-white px-3 rounded-r hover:bg-lockedin-purple-dark"
              disabled={!currentGoal.trim()}
            >
              Add
            </button>
          </div>
        )}

        <button
          onClick={handleFinalizeGoals}
          className={`mt-4 w-full p-2 rounded ${
            goals.length === 3 ? 'bg-lockedin-purple text-white' : 'bg-gray-200 text-gray-500'
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
