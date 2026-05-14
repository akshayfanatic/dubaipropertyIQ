/**
 * Amenity Types
 * Types for area amenities (schools, malls, metro, parks) in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters, SelectOption } from './shared';
import type { ImageObject } from './images';
import { Tables } from './db/supabase-generated';

export type Amenity = Tables<'amenities'>;

export type AmenityInsert = Omit<Amenity, 'id' | 'created_at' | 'updated_at'>;
export type AmenityUpdate = Partial<AmenityInsert>;

/**
 * Amenity option for select dropdowns
 */
export type AmenityOption = SelectOption & {
  logo_url?: ImageObject | null;
};

/**
 * Amenity filters for admin list page
 * Extends shared pagination and search filters
 */
export interface AmenityFilters extends PaginationFilters, SearchFilters {}
