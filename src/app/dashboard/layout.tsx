// app/dashboard/layout.tsx
import { getSupabaseUserSession } from '@/lib/API/Services/supabase/user';
import { redirect } from 'next/navigation';
import config from '@/lib/config/auth';
import DashboardShell from '@/components/DashboardShell';
import { LayoutProps } from '@/lib/types/types';
import { ToastContainer } from 'react-toastify';

export default async function DashboardLayout({ children }: LayoutProps) {
  const sessionData = await getSupabaseUserSession();
  if (!sessionData?.session) {
    redirect(config.routes.login.link);
  }

  const displayName = sessionData.user?.profile?.display_name ?? 'User';
  const email = sessionData.user?.email ?? '';

  return (
    <>
      <ToastContainer />
      <DashboardShell displayName={displayName} email={email}>
        {children}
      </DashboardShell>
    </>
  );
}
