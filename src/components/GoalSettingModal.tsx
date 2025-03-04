// GoalSettingModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { SupabaseUser } from '@/lib/API/Services/supabase/user';

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalSettingModal = ({ isOpen, onClose }: GoalSettingModalProps) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await SupabaseUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleFinalizeGoals = async () => {
    if (goals.length !== 3) return;

    setIsGenerating(true);
    try {
      const taskResponse = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals })
      });

      if (!taskResponse.ok) {
        throw new Error(`HTTP error! Status: ${taskResponse.status}`);
      }

      const { tasks } = await taskResponse.json();
      if (!tasks) throw new Error('Failed to generate tasks');

      const saveResponse = await fetch('/api/save-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, userId: user.id })
      });

      if (!saveResponse.ok) throw new Error('Failed to save tasks');

      onClose();
    } catch (error) {
      console.error('Task generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddGoal = () => {
    if (goals.length >= 3 || !currentGoal.trim()) return;
    setGoals((prev) => [...prev, currentGoal.trim()]);
    setCurrentGoal('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Set Your 3 Goals</h2>

        {goals.length < 3 ? (
          <div className="space-y-4">
            <input
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              placeholder="Enter your goal..."
              className="w-full p-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <button
              onClick={handleAddGoal}
              className="w-full bg-primary text-white p-2 rounded hover:bg-primary-dark"
            >
              Add Goal ({goals.length}/3)
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">3 Goals Set! Generate Tasks</p>
            <button
              onClick={handleFinalizeGoals}
              disabled={isGenerating}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating 9 Tasks...' : 'Generate Daily Tasks'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
