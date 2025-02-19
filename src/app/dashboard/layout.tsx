// app/dashboard/layout.tsx
import { SupabaseSession } from '@/lib/API/Services/supabase/user';
import { GetProfileByUserId } from '@/lib/API/Database/profile/queries';
import { redirect } from 'next/navigation';
import config from '@/lib/config/auth';
import { ProfileT } from '@/lib/types/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { LayoutProps } from '@/lib/types/types';
import DashboardShell from '@/components/DashboardShell';

export default async function DashboardLayout({ children }: LayoutProps) {
  const sessionResponse = await SupabaseSession();
  const session = sessionResponse?.session;

  if (!session) {
    redirect(config.redirects.requireAuth);
  }

  let profile: PostgrestSingleResponse<ProfileT[]> | null = null;
  if (session?.user) {
    profile = await GetProfileByUserId(session.user.id);
  }

  const displayName = profile?.data?.[0]?.display_name;
  const email = session?.user?.email;

  return (
    <DashboardShell displayName={displayName} email={email}>
      {children}
    </DashboardShell>
  );
}
