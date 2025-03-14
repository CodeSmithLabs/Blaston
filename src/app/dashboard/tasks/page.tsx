// dashboard/tasks/page.tsx
'use client';

import { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import TasksManager from '@/components/TasksManager';
import { GoalSettingModal } from '@/components/GoalSettingModal';

export default function TasksPage() {
  const { userProfile } = useUserProfile();
  const [showGoalModal, setShowGoalModal] = useState(false);

  if (!userProfile) return <div className="py-4 lg:px-16">Loading...</div>;

  return (
    <section className="py-4 lg:px-16 bg-card text-card-foreground">
      <h2 className="text-2xl font-serif font-bold mb-4">Daily Tasks</h2>
      <GoalSettingModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        userProfile={userProfile}
      />
      {userProfile.has_set_initial_goals && <TasksManager userProfile={userProfile} />}
    </section>
  );
}
