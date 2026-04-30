'use client';

import * as React from 'react';
import { SWRProvider } from '@/providers/swr-provider';

interface FrontendProviderProps {
  children: React.ReactNode;
}

export function FrontEndProvider({ children }: FrontendProviderProps) {
  return <SWRProvider>{children}</SWRProvider>;
}
