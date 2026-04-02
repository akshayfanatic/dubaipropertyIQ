/**
 * City Types
 * Types for UAE cities in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters } from './shared';
import type { ImageObject } from './images';

export interface City {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url: ImageObject | null;
  created_at: string;
  updated_at: string;
}

export type CityInsert = Omit<City, 'id' | 'created_at' | 'updated_at'>;
export type CityUpdate = Partial<CityInsert>;

/**
 * City option for select dropdowns
 */
export type CityOption = {
  label: string;
  value: string;
  logo_url?: ImageObject | null;
};

/**
 * City filters for admin list page
 * Extends shared pagination and search filters
 */
export interface CityFilters extends PaginationFilters, SearchFilters {}
