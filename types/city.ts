/**
 * City Types
 * Types for UAE cities in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters, SelectOption } from './shared';
import type { ImageObject } from './images';
import { Tables } from './db/supabase-generated';

export type City = Tables<'cities'>;

export type CityInsert = Omit<City, 'id' | 'created_at' | 'updated_at'>;

export type CityWithAreaCount = City & {
  area_count: number;
};
export type CityUpdate = Partial<CityInsert>;

/**
 * City option for select dropdowns
 */
export type CityOption = SelectOption & {
  slug: string; // City slug for reference
  logo_url?: ImageObject | null;
};

/**
 * City filters for admin list page
 * Extends shared pagination and search filters
 */
export interface CityFilters extends PaginationFilters, SearchFilters {}
