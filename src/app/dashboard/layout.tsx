// app/dashboard/layout.tsx
'use client';

import DashboardShell from '@/components/DashboardShell';
import { LayoutProps } from '@/lib/types/types';

export default function DashboardLayout({ children }: LayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}
