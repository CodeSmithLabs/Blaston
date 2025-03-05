'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, TrashIcon } from 'lucide-react';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';
import { saveAITasks } from '@/app/actions/tasks';

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
      if (!tasks || !Array.isArray(tasks)) throw new Error('Invalid tasks data from AI.');

      const goalsData = goals.map((goal, index) => ({
        goal,
        tasks: Array.isArray(tasks[index]) ? tasks[index] : []
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

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-background text-foreground p-6 rounded-lg shadow-lg">
          <Dialog.Close className="absolute top-3 right-3 text-foreground">
            <X size={20} />
          </Dialog.Close>

          <h2 className="text-lg font-semibold">Enter Your Goals</h2>
          <p className="text-sm text-muted-foreground">
            Set up to 3 goals that you want to focus on.
          </p>

          {error && <p className="text-destructive text-sm mt-2">{error}</p>}

          <div className="mt-4 space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-center gap-2 bg-card p-2 rounded">
                <span className="flex-1 text-card-foreground">{goal}</span>
                <button onClick={() => handleRemoveGoal(index)} className="text-destructive">
                  <TrashIcon size={16} />
                </button>
              </div>
            ))}

            {goals.length < 3 && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  className="w-full p-2 border border-border rounded bg-background text-foreground"
                  placeholder={`Goal ${goals.length + 1}`}
                />
                <button
                  onClick={handleAddGoal}
                  className="text-primary hover:text-primary-foreground transition"
                  disabled={!currentGoal.trim()}
                >
                  + Add
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleFinalizeGoals}
              className={`px-4 py-2 rounded ${
                goals.length === 3
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              } transition`}
              disabled={goals.length !== 3 || isGenerating}
            >
              {isGenerating ? 'Saving...' : 'Save Goals'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
