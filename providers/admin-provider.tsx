'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SWRProvider } from '@/providers/swr-provider';

interface AdminProviderProps {
  children: React.ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SWRProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </SWRProvider>
    </ThemeProvider>
  );
}
