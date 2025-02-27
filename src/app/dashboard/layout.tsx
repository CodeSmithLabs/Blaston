// app/dashboard/layout.tsx
import { SupabaseSession } from '@/lib/API/Services/supabase/user';
import { redirect } from 'next/navigation';
import config from '@/lib/config/auth';
import DashboardShell from '@/components/DashboardShell';
import { LayoutProps } from '@/lib/types/types';
import { ToastContainer } from 'react-toastify';

export default async function DashboardLayout({ children }: LayoutProps) {
  const sessionResponse = await SupabaseSession();
  const session = sessionResponse?.session;

  if (!session) {
    redirect(config.redirects.requireAuth);
  }

  const displayName = session?.profile?.display_name;
  const email = session?.user?.email;

  return (
    <>
      <ToastContainer />
      <DashboardShell displayName={displayName} email={email}>
        {children}
      </DashboardShell>
    </>
  );
}
