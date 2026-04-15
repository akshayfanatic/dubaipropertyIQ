'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swr-config';

interface SWRProviderProps {
  children: React.ReactNode;
}

/**
 * SWR Provider - wraps app with global SWR configuration
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
