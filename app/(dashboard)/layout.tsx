import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

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
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container py-6">{children}</main>
    </div>
  );
}
