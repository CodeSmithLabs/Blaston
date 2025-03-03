'use client';
import { useEffect, useState } from 'react';
import TasksManager from '@/components/TasksManager';
import { GoalSettingModal } from '@/components/GoalSettingModal';
import { SupabaseUser } from '@/lib/API/Services/supabase/user';

export default function TasksPage() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialGoals = async () => {
      const user = await SupabaseUser();
      if (user) {
        setUserProfile(user.profile);
        setShowGoalModal(!user.profile?.has_set_initial_goals);
      }
      setLoading(false);
    };

    checkInitialGoals();
  }, []);

  const handleGoalSetComplete = async () => {
    const user = await SupabaseUser();
    setUserProfile(user?.profile);
    setShowGoalModal(false);
  };

  if (loading) return <div className="py-4 lg:px-16">Loading...</div>;

  return (
    <section className="py-4 lg:px-16 bg-card text-card-foreground">
      <h2 className="text-2xl font-bold mb-4">My Goals & Tasks</h2>

      <GoalSettingModal isOpen={showGoalModal} onClose={handleGoalSetComplete} />

      {userProfile?.has_set_initial_goals && <TasksManager />}
    </section>
  );
}
