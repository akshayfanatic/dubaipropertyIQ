/**
 * Property Types
 * Types for property listings in DubaiPropertyIQ
 */

import { Category } from './category';
import type { PaginatedResult, SelectOption, Location, FAQ } from './shared';
import type { ImageObject } from './images';
import type { Amenity } from './amenities';
import { Tables, TablesInsert, TablesUpdate } from './db/supabase-generated';
import { Developer } from './developer';
import type { PropertyStatus } from './enums';

// Re-export for convenience
export type { PaginatedResult, Location };
export type { PropertyStatus } from './enums';

// Keep for backward compatibility with existing code
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'land';

/**
 * PropertyFAQ - FAQ for a property
 * Extends the shared FAQ type with property_id
 */
export interface PropertyFAQ extends FAQ {
  property_id: string;
}

/**
 * PropertyFAQInsert - Insert type for PropertyFAQ (without id and created_at)
 */
export type PropertyFAQInsert = Omit<PropertyFAQ, 'id' | 'created_at'>;

/**
 * PropertyAmenity - Junction table row linking property to amenity
 * Matches db.ts structure exactly
 */
export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity_id: string;
  created_at: string | null;
}

export type PropertySEO = Tables<'properties_seo'>;
export type PropertySEOInsert = TablesInsert<'properties_seo'>;
export type PropertySEOUpdate = TablesUpdate<'properties_seo'>;

// Override JSON fields with proper types
export type Property = Omit<Tables<'properties'>, 'location' | 'photos' | 'features'> & {
  location?: Location | null;
  photos: ImageObject[];
  features: string[];
  properties_faqs?: PropertyFAQ[];
  properties_amenities?: PropertyAmenities;
  properties_seo?: PropertySEO | null;
  amenities?: Amenity[]; // Populated via joins for form display
  developer?: Developer;
};

export type PropertyFAQs = Tables<'properties_faqs'>;
export type PropertyAmenities = Tables<'properties_amenities'>;

export type PropertyInsert = Omit<Property, 'id' | 'slug' | 'created_at' | 'updated_at' | 'properties_faqs'> & {
  slug?: string;
  properties_faqs?: PropertyFAQInsert[];
};

export type PropertyUpdate = Partial<PropertyInsert>;

export type SortOrder = 'asc' | 'desc';

// Updated filters to use category_id
export interface PropertyFilters {
  search?: string;
  property_type?: PropertyType; // Keep for backward compat
  category_id?: string;
  category_slug?: string; // New: filter by slug
  city_id?: string;
  city_slug?: string; // New: filter by city slug
  status?: PropertyStatus;
  bedrooms?: number;
  min_price?: number;
  max_price?: number;
  min_size?: number;
  max_size?: number;
  golden_visa_eligible?: boolean;
  is_featured?: boolean;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

// Helper type for category with joined data
export type PropertyWithCategory = Property & { category: Category };

// Type for list view with partial category (from joins)
// Supabase joins return category as an array
export interface PropertyListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: { id: string; name: string }[];
  city?: { id: string; name: string; slug: string; logo_url?: ImageObject | null }[];
  developer?: { id: string; name: string; logo_url?: ImageObject | null }[] | null;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  price_aed: number;
  status: PropertyStatus;
  golden_visa_eligible: boolean;
  is_featured: boolean;
  photos: ImageObject[]; // Changed from string[]
  features: string[];
  floor_plan: string | null;
  location?: Location | null; // NEW: Location coordinates (lat/lng)
  city_id?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Property option for select dropdowns
 */
export type PropertyOption = SelectOption & {
  logo_url?: ImageObject | null;
};
