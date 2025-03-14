//auth/confirm-expired/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-md p-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Link Expired or Invalid</h1>
        <p className="mt-2 text-muted-foreground">
          Your confirmation link is no longer valid. Request a new link or sign up again.
        </p>

        <div className="mt-4">
          <input
            type="email"
            className="w-full px-4 py-2 border border-input rounded-md bg-muted text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button
          onClick={handleResendConfirmation}
          disabled={loading || !email}
          className="w-full mt-4"
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {loading ? 'Resending...' : 'Request New Confirmation'}
        </Button>

        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}

        <div className="mt-6">
          <p className="text-muted-foreground">Or, create a new account:</p>
          <Link href="/auth/signup">
            <Button variant="secondary" className="mt-2 w-full">
              Sign Up Again
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
