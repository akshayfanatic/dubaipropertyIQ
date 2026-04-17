/**
 * SWR Configuration
 *
 * Centralized SWR config for global data fetching management.
 * Use with server actions for mutations.
 */

import type { SWRConfiguration } from 'swr';

/**
 * SWR Fetcher
 * Reusable fetcher for SWR hooks
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};

/**
 * Global SWR defaults
 */
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 2000,
  errorRetryCount: 2,
};

/**
 * Predefined options for common scenarios
 */
export const swrOptions = {
  /** Data that changes rarely - max caching */
  static: { revalidateOnFocus: false, revalidateOnReconnect: false, revalidateIfStale: false },

  /** User-specific data - revalidate on focus */
  user: { revalidateOnFocus: true },

  /** One-time fetch - no revalidation */
  once: { revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false },
};
