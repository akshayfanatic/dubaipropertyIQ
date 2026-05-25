/**
 * Developer Types
 * Types for property developers in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters } from './shared';
import type { ImageObject } from './images';
import { Tables } from './db/supabase-generated';

export type Developer = Omit<Tables<'developers'>, 'logo_url'> & {
  logo_url: ImageObject | null;
};

// Computed trust score (average of all components)
export type DeveloperWithTrustScore = Developer & {
  trust_score: number;
};

export type DeveloperInsert = Omit<Developer, 'id' | 'created_at' | 'updated_at'>;
export type DeveloperUpdate = Partial<DeveloperInsert>;

/**
 * Developer option for select dropdowns
 */
export type DeveloperOption = {
  label: string;
  value: string;
  logo_url: ImageObject | null;
};

/**
 * Developer filters for admin list page
 */
export interface DeveloperFilters extends PaginationFilters, SearchFilters {}
