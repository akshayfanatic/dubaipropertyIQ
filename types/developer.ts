/**
 * Developer Types
 * Types for property developers in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters } from './shared';

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  website_url: string | null;

  // Trust Score Components (1-5 scale per PRD)
  delivery_timeliness_score: number;
  service_charge_score: number;
  build_quality_score: number;
  after_sales_score: number;

  // Stats
  total_projects: number;
  completed_projects: number;
  ongoing_projects: number;
  years_active: number;

  created_at: string;
  updated_at: string;
}

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
  logo_url: string;
};

/**
 * Developer filters for admin list page
 */
export interface DeveloperFilters extends PaginationFilters, SearchFilters {}
