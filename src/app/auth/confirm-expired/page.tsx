// app/auth/confirm-expired/page.tsx
'use client';

import Link from 'next/link';

export default function ConfirmExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Link Expired or Invalid</h1>
      <p className="mb-6">
        Your confirmation link is no longer valid. Please request a new link or sign up again.
      </p>
      <Link
        href="/auth/signup"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Request New Link
      </Link>
    </div>
  );
}
