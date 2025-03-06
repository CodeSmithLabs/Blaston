'use client';
import { useEffect, useState } from 'react';
import TasksManager from '@/components/TasksManager';
import { GoalSettingModal } from '@/components/GoalSettingModal';
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';

interface UserProfile {
  id: string;
  has_set_initial_goals: boolean;
  goals?: any[];
}

export default function TasksPage() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialGoals = async () => {
      const user = await getSupabaseUserSession(true);
      if (user?.user.profile) {
        setUserProfile(user.user.profile);
        setShowGoalModal(!user.user.profile.has_set_initial_goals);
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
    setShowGoalModal(false);
  };

  if (loading) return <div className="py-4 lg:px-16">Loading...</div>;

  return (
    <section className="py-4 lg:px-16 bg-card text-card-foreground">
      <h2 className="text-2xl font-serif font-bold mb-4">Daily Tasks </h2>

      <GoalSettingModal isOpen={showGoalModal} onClose={handleGoalSetComplete} />

      {userProfile?.has_set_initial_goals && <TasksManager />}
    </section>
  );
}
