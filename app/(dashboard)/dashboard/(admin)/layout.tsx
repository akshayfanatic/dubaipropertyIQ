import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { requireAuth } from '@/lib/auth/guards';
import { serverClient } from '@/lib/supabase/server';
import { SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/dashboard/admin/admin-sidebar';
import { AdminHeader } from '@/components/dashboard/admin/admin-header';
import { AdminProvider } from '@/components/providers/admin-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AdminProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader user={user} />
            <main className="flex-1 p-6">{children}</main>
          </SidebarInset>
        </AdminProvider>
      </body>
    </html>
  );
}
