// app/auth/confirm/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      router.push('/');
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ access_token, refresh_token })
      })
        .then(async (res) => {
          if (!res.ok) {
            setError(true);
            return;
          }
          await res.json();
          router.push('/dashboard/tasks');
        })
        .catch(() => {
          setError(true);
        });
    } else {
      router.push('/');
    }
  }, [router]);

  if (error) {
    router.push('/auth/signup-error');
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Confirming your account...</p>
    </div>
  );
}
