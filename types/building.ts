/**
 * Building Types
 * Types for area-linked building intelligence pages.
 */

import type { PaginationFilters, SearchFilters, SelectOption, Location } from './shared';
import type { Tables, TablesInsert, TablesUpdate } from './db/supabase-generated';
import type { ImageObject } from './images';
import type { Area } from './areas';
import type { City } from './city';
import type { Developer } from './developer';

export type BuildingUnitRange = {
  unit_type: string;
  min?: number | null;
  max?: number | null;
  average?: number | null;
};

export type BuildingNearbyPlace = {
  name: string;
  type?: string | null;
  distance?: string | null;
};

export type BuildingAmenityDetail = {
  id: string;
  name: string;
  logo_url?: ImageObject | null;
};

export type BuildingTransactionSummary = {
  recent_sales_count?: number | null;
  average_transaction_value?: number | null;
  price_trend?: string | null;
  notes?: string | null;
};

export type BuildingJsonFields = {
  location?: Location | null;
  photos: ImageObject[];
  property_types: string[];
  amenities: string[];
  nearby_places: BuildingNearbyPlace[];
  unit_price_ranges: BuildingUnitRange[];
  rental_ranges: BuildingUnitRange[];
  transaction_summary: BuildingTransactionSummary;
  pros: string[];
  cons: string[];
};

export type Building = Omit<
  Tables<'buildings'>,
  'location' | 'photos' | 'property_types' | 'amenities' | 'nearby_places' | 'unit_price_ranges' | 'rental_ranges' | 'transaction_summary' | 'pros' | 'cons'
> &
  BuildingJsonFields;

export type BuildingInsert = Omit<
  TablesInsert<'buildings'>,
  'location' | 'photos' | 'property_types' | 'amenities' | 'nearby_places' | 'unit_price_ranges' | 'rental_ranges' | 'transaction_summary' | 'pros' | 'cons'
> &
  Partial<BuildingJsonFields>;

export type BuildingUpdate = Omit<
  TablesUpdate<'buildings'>,
  'location' | 'photos' | 'property_types' | 'amenities' | 'nearby_places' | 'unit_price_ranges' | 'rental_ranges' | 'transaction_summary' | 'pros' | 'cons'
> &
  Partial<BuildingJsonFields>;

export type BuildingWithRelations = Building & {
  area?: Pick<Area, 'id' | 'name' | 'slug'> | null;
  city?: Pick<City, 'id' | 'name' | 'slug' | 'logo_url'> | null;
  developer?: Pick<Developer, 'id' | 'name' | 'slug' | 'logo_url'> | null;
  amenity_details?: BuildingAmenityDetail[];
};

export interface BuildingFilters extends PaginationFilters, SearchFilters {
  area_id?: string;
  city_id?: string;
  developer_id?: string;
}

export type BuildingOption = SelectOption & {
  area_id?: string;
  city_id?: string;
};
