/**
 * Property Types
 * Types for property listings in DubaiPropertyIQ
 */

export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'land';

export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'off_plan';

export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: PropertyType;
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

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

export type PropertyUpdate = Partial<PropertyInsert>;

export type SortOrder = 'asc' | 'desc';

export interface PropertyFilters {
  search?: string;
  property_type?: PropertyType;
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

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
