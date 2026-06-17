'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SWRProvider } from '@/providers/swr-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface AgentProviderProps {
  children: React.ReactNode;
}

export function AgentProvider({ children }: AgentProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NuqsAdapter>
        <SWRProvider>
          <AuthProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </AuthProvider>
        </SWRProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
