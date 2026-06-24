import type { Metadata } from 'next';
import '@/app/(dashboard)/dashboard/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { requireAuth } from '@/lib/auth/guards';
import { noIndexMetadata } from '@/lib/utils/seo';
import { SidebarInset } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AgentHeader } from '@/components/dashboard/agent/agent-header';
import { AgentSidebar } from '@/components/dashboard/agent/agent-sidebar';
import { AgentProvider } from '@/providers/agent-provider';

export const metadata: Metadata = {
  title: 'Dubai Property IQ Agent',
  ...noIndexMetadata,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function AgentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} h-svh overflow-hidden antialiased`} suppressHydrationWarning>
        <AgentProvider>
          <AgentSidebar />
          <SidebarInset>
            <AgentHeader />
            <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
            <Toaster />
          </SidebarInset>
        </AgentProvider>
      </body>
    </html>
  );
}
