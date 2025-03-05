//components/GoalOnboarding.tsx
import { useState } from 'react';
import { GoalSettingModal } from './GoalSettingModal';

export default function GoalOnboarding({
  isOpen,
  onComplete
}: {
  isOpen: boolean;
  onComplete: () => void;
}) {
  const [showGoalModal, setShowGoalModal] = useState(false);

  const handleProceed = () => setShowGoalModal(true);
  const handleGoalSetComplete = () => {
    setShowGoalModal(false);
    onComplete();
  };

  return (
    <>
      {isOpen && !showGoalModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm">
          <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-md text-center border border-border">
            <h2 className="text-xl font-semibold">Welcome to LockedIn</h2>
            <p className="mt-2 text-muted-foreground">
              Get started by setting 3 key goals. We&apos;ll generate daily tasks to help you
              achieve them.
            </p>
            <button
              onClick={handleProceed}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {showGoalModal && <GoalSettingModal isOpen={true} onClose={handleGoalSetComplete} />}
    </>
  );
}
