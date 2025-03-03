// components/GoalSettingModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { SupabaseUser } from '@/lib/API/Services/supabase/user';
import { generateTasks } from '@/lib/togetherAI';
import { TasksAPI } from '@/lib/API/Services/supabase/tasks';

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
      // Generate tasks for all 3 goals at once
      const allTasks = await Promise.all(
        goals.map(async (goal) => {
          const aiTasks = await generateTasks(goal);
          return {
            goal: goal.trim(),
            tasks:
              aiTasks?.output
                ?.split('\n')
                .filter((t) => t.trim())
                .slice(0, 3)
                .map((t) => t.replace(/^\d+\.\s*/, '').trim()) || []
          };
        })
      );

      // Save all goals and tasks to Supabase
      await TasksAPI.saveAITasks(allTasks, user.id);
      onClose();
    } catch (error) {
      console.error('AI Task generation failed:', error);
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
