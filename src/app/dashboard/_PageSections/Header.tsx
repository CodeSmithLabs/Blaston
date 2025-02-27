// app/dashboard/_PageSections/Header.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/DropdownMenu';
import { Menu, MoreVertical, LogOut, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SupabaseSignOut } from '@/lib/API/Services/supabase/auth';
import { ThemeDropDownMenu } from '@/components/ThemeDropdown';
import { useState } from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  displayName?: string;
  email?: string;
}

export default function Header({ onToggleSidebar, displayName, email }: HeaderProps) {
  const router = useRouter();

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

      <EditableDisplayName
        initialName={displayName || email?.split('@')[0] || 'Tasks'}
        fullEmail={email}
      />

      <div className="flex items-center gap-2">
        <ThemeDropDownMenu />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none transition-colors hover:text-primary">
            <MoreVertical className="w-6 h-6 text-primary cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover text-popover-foreground rounded-md shadow p-1">
            <div className="px-3 py-1 text-sm border-b border-border">
              {email || displayName || 'No Email'}
            </div>
            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-1 cursor-pointer hover:bg-muted transition-colors text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function EditableDisplayName({
  initialName,
  fullEmail
}: {
  initialName: string;
  fullEmail?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialName);

  const handleSave = async () => {
    setEditing(false);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ display_name: value })
      });
      const data = await res.json();

      if (data.success && data.profile) {
        setValue(data.profile.display_name);
      }
    } catch (err) {
      console.error('Failed to update display name:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (editing) {
    return (
      <input
        className="text-lg font-semibold text-primary bg-transparent border-b border-border focus:outline-none focus:border-primary font-mono"
        autoFocus
        value={value ?? ''} // Prevents undefined errors
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div className="flex items-center gap-1 cursor-pointer group" onClick={() => setEditing(true)}>
      <h1 className="text-lg font-semibold text-primary group-hover:underline group-hover:text-primary/80 transition-colors">
        {value}
      </h1>
      <Edit3 className="h-4 w-4 text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
