// app/auth/layout.tsx

import { MainLogoText } from '@/components/MainLogo';
import { Separator } from '@/components/ui/Separator';
import { LayoutProps } from '@/lib/types/types';
import { ThemeDropDownMenu } from '@/components/ThemeDropdown';
import { ensureUserProfile } from '@/lib/API/Services/supabase/user';
import { ToastContainer } from 'react-toastify';

export default async function AuthLayout({ children }: LayoutProps) {
  const sessionData = await ensureUserProfile();

  return (
    <>
      <ToastContainer />
      <div>
        <header className="p-6 mb-4">
          <div className="flex justify-between items-center">
            <MainLogoText />
            <ThemeDropDownMenu />
          </div>
          <Separator />
        </header>

        <main className="grid justify-center items-center">{children}</main>
      </div>
    </>
  );
}
