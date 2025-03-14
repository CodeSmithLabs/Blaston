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
import { useUserProfile } from '@/context/UserProfileContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  const { userProfile, setUserProfile } = useUserProfile();

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
        initialName={userProfile?.display_name || userProfile?.email?.split('@')[0] || 'Tasks'}
        setUserProfile={setUserProfile}
      />

      <div className="flex items-center gap-2">
        <ThemeDropDownMenu />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none transition-colors hover:text-primary">
            <MoreVertical className="w-6 h-6 text-primary cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover text-popover-foreground rounded-md shadow p-1">
            <div className="px-3 py-1 text-sm border-b border-border">
              {userProfile?.email || userProfile?.display_name || 'No Email'}
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
  setUserProfile
}: {
  initialName: string;
  setUserProfile: (profile: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialName);

  const handleSave = () => {
    setEditing(false);
    setUserProfile((prev: any) => ({ ...prev, display_name: value, email: prev.email })); // Ensure email is not modified
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
        value={value}
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
