'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-opacity-90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
