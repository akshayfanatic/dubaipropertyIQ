/**
 * Property Types
 * Types for property listings in DubaiPropertyIQ
 */

import { Category } from './category';
import type { PaginatedResult } from './shared';

// Re-export for convenience
export type { PaginatedResult };

// Keep for backward compatibility with existing code
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'land';

export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'off_plan';

export interface Property {
  id: string;
  title: string;
  description: string;
  category_id: string;
  category?: Category; // for joins
  developer_id: string | null;
  developer?: { id: string; name: string; logo_url: string | null }; // for joins
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  price_aed: number;
  status: PropertyStatus;
  golden_visa_eligible: boolean;
  photos: string[];
  features: string[];
  floor_plan: string | null;
  created_at: string;
  updated_at: string;
}

// Keep for backward compatibility with existing code
export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

export type PropertyUpdate = Partial<PropertyInsert>;

export type SortOrder = 'asc' | 'desc';

// Updated filters to use category_id
export interface PropertyFilters {
  search?: string;
  property_type?: PropertyType; // Keep for backward compat
  category_id?: string;
  category_slug?: string; // New: filter by slug
  status?: PropertyStatus;
  bedrooms?: number;
  min_price?: number;
  max_price?: number;
  min_size?: number;
  max_size?: number;
  golden_visa_eligible?: boolean;
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
  title: string;
  description: string;
  category?: { id: string; name: string }[];
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  price_aed: number;
  status: PropertyStatus;
  golden_visa_eligible: boolean;
  photos: string[];
  features: string[];
  floor_plan: string | null;
  created_at: string;
  updated_at: string;
}
