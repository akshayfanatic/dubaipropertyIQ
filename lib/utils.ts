import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simulate network delay for loading state testing (remove in production)
export const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
