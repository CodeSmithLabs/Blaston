// components/Header.tsx
'use client';

import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@radix-ui/react-dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SupabaseSignOut } from '@/lib/API/Services/supabase/auth';

interface HeaderProps {
  email?: string;
  display_name?: string;
  avatar_url?: string;
}

export default function Header({ email, display_name, avatar_url }: HeaderProps) {
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
    <header className="flex items-center justify-between bg-lockedin-purple p-4 text-white">
      <h1 className="text-lg font-semibold">LockedIn Dashboard</h1>
      <div className="flex items-center gap-4">
        <span>{display_name || email}</span>
        {avatar_url && (
          <Image src={avatar_url} alt="avatar" width={32} height={32} className="rounded-full" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src={avatar_url || '/default-avatar.png'}
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-white text-black rounded-md shadow-lg">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-200"
              onClick={handleLogout}
            >
              <LogOutIcon size={16} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
