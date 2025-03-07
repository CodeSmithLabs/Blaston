// dashboard/tasks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import TasksManager from '@/components/TasksManager';
import { GoalSettingModal } from '@/components/GoalSettingModal';
import { ensureUserProfile } from '@/lib/API/Services/supabase/user';

export default function TasksPage() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await ensureUserProfile();
      setUserProfile(data.profile);
      setShowGoalModal(!data.profile.has_set_initial_goals);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div className="py-4 lg:px-16">Loading...</div>;

  return (
    <section className="py-4 lg:px-16 bg-card text-card-foreground">
      <h2 className="text-2xl font-serif font-bold mb-4">Daily Tasks</h2>
      <GoalSettingModal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} />
      {userProfile?.has_set_initial_goals && <TasksManager />}
    </section>
  );
}
