'use client';

import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Almost done!</h2>
      <p className="text-gray-800 mb-6">We’ve sent a confirmation link to your email.</p>
      {/* <Link href="/" className="text-blue-600 hover:underline">
        Return Home
      </Link> */}
    </div>
  );
}
