import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Developer } from '@/types/developer';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Function For Delaying async execution
 * @param ms Default 1000ms
 */
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

/**
 * Calculate trust score from component scores (1-5 scale)
 * Returns value as percentage (0-100) for display
 */
export function calculateTrustScore(developer: Pick<Developer, 'delivery_timeliness_score' | 'service_charge_score' | 'build_quality_score' | 'after_sales_score'>): number {
  const { delivery_timeliness_score, service_charge_score, build_quality_score, after_sales_score } = developer;
  const avg = (delivery_timeliness_score + service_charge_score + build_quality_score + after_sales_score) / 4;
  return Math.round((avg / 5) * 100); // Convert to 0-100 scale
}

/**
 * Get trust score label based on score
 */
export function getTrustScoreLabel(score: number): { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' } {
  if (score >= 80) return { label: 'Excellent', variant: 'default' };
  if (score >= 60) return { label: 'Good', variant: 'secondary' };
  if (score >= 40) return { label: 'Average', variant: 'outline' };
  return { label: 'Poor', variant: 'destructive' };
}

/**
 * Generate URL-friendly slug from text
 * Converts text to lowercase, replaces spaces with hyphens, removes special characters
 * @param text - The text to convert to slug
 * @returns URL-friendly slug string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
