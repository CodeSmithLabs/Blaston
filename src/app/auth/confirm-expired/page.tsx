'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function ConfirmExpiredPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendConfirmation = async () => {
    setLoading(true);
    setMessage('');

    const response = await fetch('/api/auth/resend-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    setLoading(false);

    if (data.success) {
      setMessage('A new confirmation email has been sent.');
    } else {
      setMessage(data.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Link Expired or Invalid</h1>
        <p className="mb-6 text-gray-600">
          Your confirmation link is no longer valid. Request a new link or sign up again.
        </p>

        <div className="mb-6">
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          onClick={handleResendConfirmation}
          disabled={loading || !email}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
          {loading ? 'Resending...' : 'Request New Confirmation'}
        </button>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

        <div className="mt-6">
          <p className="text-gray-600">Or, create a new account:</p>
          <Link
            href="/auth/signup"
            className="mt-2 inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign Up Again
          </Link>
        </div>
      </div>
    </div>
  );
}
