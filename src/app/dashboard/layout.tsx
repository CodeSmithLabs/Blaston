// app/dashboard/layout.tsx
import DashboardShell from '@/components/DashboardShell';
import { LayoutProps } from '@/lib/types/types';
import { ToastContainer } from 'react-toastify';

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <>
      <ToastContainer />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
