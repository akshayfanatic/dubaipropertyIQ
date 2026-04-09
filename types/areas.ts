/**
 * Area Types
 * Types for neighborhoods/communities within cities in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters, SelectOption, FAQ, Location } from './shared';

export interface Area {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  description: string | null; // Matches database (can be null)
  location?: Location | null; // Generic Location type from shared
  photos: string[] | null; // Matches database (can be null)
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
 * Extends generic FAQ with area_id
 */
export interface AreaFAQ extends FAQ {
  area_id: string;
}

// Amenities FAQ has the same shape as general Area FAQ
// Reusing the same type for both (DRY principle)
export type AreaAmenityFAQ = AreaFAQ;

export type AreaFAQInsert = Omit<AreaFAQ, 'id' | 'created_at'>;
export type AreaAmenityFAQInsert = Omit<AreaAmenityFAQ, 'id' | 'created_at'>;

export interface AreaFormProps {
  area?: Area & {
    cities?: { name: string } | null;
    areas_amenities?: Array<{ amenity_id: string }>;
    areas_properties?: Array<{ property_id: string }>;
    areas_faqs?: Array<{ id: string; question: string; answer: string }>;
    areas_amenities_faqs?: Array<{ id: string; question: string; answer: string }>;
  };
}
