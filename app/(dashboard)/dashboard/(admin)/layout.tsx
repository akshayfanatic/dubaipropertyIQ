import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth protection happens here in the layout (not in proxy)
  // This follows Next.js 16 security best practices
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background">
          <DashboardNav />
          <main className="container py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
