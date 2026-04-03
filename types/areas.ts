/**
 * Area Types
 * Types for neighborhoods/communities within cities in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters, SelectOption } from './shared';

export interface Area {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  description?: string;
  photos: string[];
  created_at: string;
  updated_at: string;
}

export type AreaInsert = Omit<Area, 'id' | 'created_at' | 'updated_at'>;
export type AreaUpdate = Partial<AreaInsert>;

/**
 * Area filters for admin list page
 * Extends shared pagination and search filters
 */
export interface AreaFilters extends PaginationFilters, SearchFilters {
  city_id?: string;
}

/**
 * Area option for select dropdowns
 */
export type AreaOption = SelectOption & {
  city_id?: string;
};

/**
 * Area FAQ (general and amenities-specific)
 */
export interface AreaFAQ {
  id: string;
  area_id: string;
  question: string;
  answer: string;
  created_at: string;
}

// Amenities FAQ has the same shape as general Area FAQ
// Reusing the same type for both (DRY principle)
export type AreaAmenityFAQ = AreaFAQ;

export type AreaFAQInsert = Omit<AreaFAQ, 'id' | 'created_at'>;
export type AreaAmenityFAQInsert = Omit<AreaAmenityFAQ, 'id' | 'created_at'>;
