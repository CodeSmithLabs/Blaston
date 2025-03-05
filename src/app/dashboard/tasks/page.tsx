//dashboard/tasks/page.tsx
'use client';
import { useEffect, useState } from 'react';
import TasksManager from '@/components/TasksManager';
import GoalOnboarding from '@/components/GoalOnboarding';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';

interface UserProfile {
  id: string;
  has_set_initial_goals: boolean;
  goals?: any[];
}

export default function TasksPage() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showTasks, setShowTasks] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialGoals = async () => {
      const user = await getSupabaseUserSession(true);
      if (user?.user.profile) {
        setUserProfile(user.user.profile);
        setShowOnboarding(!user.user.profile.has_set_initial_goals);
      }
      setLoading(false);
    };

    checkInitialGoals();
  }, []);

  const handleGoalSetComplete = async () => {
    const user = await getSupabaseUserSession(true);
    if (user?.user.profile) {
      setUserProfile(user.user.profile);
    }
    setShowOnboarding(false);
    setShowTasks(true);
  };

  if (loading) return <div className="py-4 lg:px-16 text-muted-foreground">Loading...</div>;

  return (
    <section className="py-4 lg:px-16 bg-card text-card-foreground">
      <h2 className="text-2xl font-bold mb-4">My Goals & Tasks</h2>

      {showOnboarding ? (
        <GoalOnboarding isOpen={showOnboarding} onComplete={handleGoalSetComplete} />
      ) : showTasks ? (
        <TasksManager />
      ) : null}
    </section>
  );
}
