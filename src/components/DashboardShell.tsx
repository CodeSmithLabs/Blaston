// components/DashboardShell.tsx
'use client';

import { useState } from 'react';
import SideBar from '@/app/dashboard/_PageSections/SideBar';
import Header from '@/app/dashboard/_PageSections/Header';

interface DashboardShellProps {
  displayName?: string;
  email?: string;
  children: React.ReactNode;
}

export default function DashboardShell({ displayName, email, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      <aside
        className={`
          transform top-0 left-0 w-64 h-full
          fixed md:static
          z-50
          transition-transform duration-300
          bg-card/40 md:bg-card text-card-foreground
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <SideBar />
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <Header onToggleSidebar={toggleSidebar} displayName={displayName} email={email} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
