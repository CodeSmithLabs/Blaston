// app/dashboard/_PageSections/SideBar.tsx
'use client';

import Link from 'next/link';

export default function SideBar() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <img src="/logo.png" alt="LockedIn" className="w-32" />
      </div>
      <nav className="mt-4 flex flex-col gap-2">
        <Link
          href="/dashboard/tasks"
          className="px-4 py-2 hover:bg-muted hover:text-muted-foreground transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/tasks"
          className="px-4 py-2 hover:bg-muted hover:text-muted-foreground transition-colors"
        >
          My Tasks
        </Link>
      </nav>
    </div>
  );
}
