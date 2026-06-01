'use client';

import * as React from 'react';
import { SWRProvider } from '@/providers/swr-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';

interface FrontendProviderProps {
  children: React.ReactNode;
}

export function FrontEndProvider({ children }: FrontendProviderProps) {
  return (
    <NuqsAdapter>
      <SWRProvider>
        {children}
        <Toaster position="bottom-center" />
      </SWRProvider>
    </NuqsAdapter>
  );
}
