import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulate network delay for loading state testing (remove in production)
export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

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
