import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/(dashboard)/dashboard/globals.css';
import { requireAuth } from '@/lib/auth/guards';
import { SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/dashboard/admin/admin-sidebar';
import { AdminHeader } from '@/components/dashboard/admin/admin-header';
import { AdminProvider } from '@/providers/admin-provider';
import { Toaster } from '@/components/ui/sonner';

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <AdminProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminHeader />
            <main className="flex-1 p-6">{children}</main>
            <Toaster />
          </SidebarInset>
        </AdminProvider>
      </body>
    </html>
  );
}
