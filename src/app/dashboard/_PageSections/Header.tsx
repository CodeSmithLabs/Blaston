'use client';

import Image from 'next/image';

interface HeaderProps {
  email?: string;
  display_name?: string;
  avatar_url?: string;
}

export default function Header({ email, display_name, avatar_url }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-lockedin-purple p-4 text-white">
      <h1 className="text-lg font-semibold">LockedIn Dashboard</h1>
      <div className="flex items-center gap-4">
        <span>{display_name || email}</span>
        {avatar_url && (
          <Image src={avatar_url} alt="avatar" width={32} height={32} className="rounded-full" />
        )}
      </div>
    </header>
  );
}
