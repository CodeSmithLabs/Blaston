// app/auth/complete-signup/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function CompleteSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function completeSignup() {
      try {
        const response = await fetch('/api/auth/complete-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to complete signup');
        toast.success('Profile created successfully!');
        router.push('/dashboard/tasks');
      } catch (error: any) {
        toast.error(error.message || 'An unexpected error occurred');
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    }
    completeSignup();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-lg font-semibold text-foreground">Setting up your profile...</div>
      <div className="mt-4 h-10 w-10 border-4 border-muted border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
