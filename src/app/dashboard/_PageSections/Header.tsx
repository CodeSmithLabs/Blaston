// app/dashboard/_PageSections/Header.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu';
import { Menu, MoreVertical, LogOut, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SupabaseSignOut } from '@/lib/API/Services/supabase/auth';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  displayName?: string;
  email?: string;
}

export default function Header({ onToggleSidebar, displayName, email }: HeaderProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  }

  const handleLogout = async () => {
    const { error } = await SupabaseSignOut();
    if (!error) {
      router.push('/');
    } else {
      console.error('Failed to sign out:', error.message);
    }
  };

  return (
    <header className="bg-card text-card-foreground flex items-center justify-between p-4 shadow-sm">
      <button
        className="md:hidden focus:outline-none transition-colors hover:text-primary"
        onClick={onToggleSidebar}
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      <h1 className="text-lg font-semibold text-primary">Tasks</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none transition-colors hover:text-primary">
          <MoreVertical className="w-6 h-6 text-primary cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-popover text-popover-foreground rounded-md shadow p-1">
          <div className="px-3 py-1 text-sm border-b border-border">{displayName || email}</div>

          <DropdownMenuItem
            className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-muted hover:text-muted-foreground transition-colors"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-muted transition-colors text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
