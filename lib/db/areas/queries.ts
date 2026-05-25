'use server';
/**
 * Area Queries
 * Read operations for areas
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { getPropertiesByArea } from '@/lib/db/properties/queries';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Area, AreaOption, AreaFilters, AreaFAQ, AreaAmenityFAQ } from '@/types/areas';
import type { Amenity } from '@/types/amenities';
import type { City } from '@/types/city';
import type { ImageObject } from '@/types/images';
import type { PropertyListItem } from '@/types/property';
import type { Location } from '@/types/shared';
import type { PaginatedResult } from '@/types/shared';

/**
 * Area with city information
 */
export type AreaWithCity = Area & {
  cities: {
    name: string;
    slug: string;
  } | null;
  areas_amenities?: Array<{
    amenity_id: string;
  }>;
  areas_properties?: Array<{
    property_id: string;
  }>;
  areas_faqs?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  areas_amenities_faqs?: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
};

export type AreaAmenity = Pick<Amenity, 'id' | 'name' | 'slug' | 'description'> & {
  logo_url: ImageObject | null;
};

export type AreaDetail = Omit<Area, 'location'> & {
  location?: Location | null;
  city: Pick<City, 'id' | 'name' | 'slug' | 'logo_url'> | null;
  amenities: AreaAmenity[];
  faqs: AreaFAQ[];
  amenities_faqs: AreaAmenityFAQ[];
  property_ids: string[];
  properties: PropertyListItem[];
};

type AreaDetailRow = Omit<Area, 'location'> & {
  location?: unknown;
  cities?: Pick<City, 'id' | 'name' | 'slug' | 'logo_url'> | Pick<City, 'id' | 'name' | 'slug' | 'logo_url'>[] | null;
  areas_amenities?: Array<{
    amenities?: AreaAmenity | AreaAmenity[] | null;
  }> | null;
  areas_faqs?: AreaFAQ[] | null;
  areas_amenities_faqs?: AreaAmenityFAQ[] | null;
  areas_properties?: Array<{ property_id: string }> | null;
};

function parseAreaLocation(location: unknown): Location | null {
  if (!location || typeof location !== 'object' || Array.isArray(location)) {
    return null;
  }

  const coords = location as { lat?: unknown; lng?: unknown };
  return typeof coords.lat === 'number' && typeof coords.lng === 'number' ? { lat: coords.lat, lng: coords.lng } : null;
}

function firstOrValue<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

/**
 * Get areas with city information joined
 */
export async function getAreasWithCityAdmin(filters?: AreaFilters): Promise<ApiResponse<PaginatedResult<AreaWithCity>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize;
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('areas').select('*, cities(name, slug)', { count: 'exact' });

    // Apply city filter (only if value is truthy and not empty string)
    if (filters?.city_id && filters.city_id !== '') {
      query = query.eq('city_id', filters.city_id);
    }

    // Apply search filter
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply ordering
    query = query.order('name', { ascending: true });

    // Apply pagination only if pageSize is specified
    if (pageSize) {
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const effectivePageSize = pageSize || count || 0;

    const result: PaginatedResult<AreaWithCity> = {
      data: (data || []) as AreaWithCity[],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Areas fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch areas';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get all areas for a city by city slug
 */
export async function getAreasByCity(citySlug: string): Promise<ApiResponse<Pick<Area, 'name' | 'photos' | 'slug'>[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas').select('name, photos, slug, cities!inner()').eq('cities.slug', citySlug).order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Areas fetched successfully',
      data: (data || []).map((area) => ({
        name: area.name,
        photos: area.photos,
        slug: area.slug,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch areas';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get public area detail by area slug.
 */
export async function getAreaBySlug(slug: string): Promise<ApiResponse<AreaDetail | null>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('areas')
      .select(
        `
          *,
          cities!inner(id, name, slug, logo_url),
          areas_amenities(amenities(id, name, slug, description, logo_url)),
          areas_faqs(id, area_id, question, answer, created_at),
          areas_amenities_faqs(id, area_id, question, answer, created_at),
          areas_properties(property_id)
        `,
      )
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Area not found',
          error: { code: 'NOT_FOUND' },
        });
      }

      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const row = data as AreaDetailRow;
    const propertiesResponse = await getPropertiesByArea(slug);

    if (!propertiesResponse.success) {
      return ApiResponse({
        success: false,
        status: propertiesResponse.status,
        message: propertiesResponse.message,
        error: propertiesResponse.error,
      });
    }

    const amenities = row.areas_amenities?.map((item) => firstOrValue(item.amenities)).filter((amenity): amenity is AreaAmenity => Boolean(amenity)) ?? [];

    const area: AreaDetail = {
      ...row,
      location: parseAreaLocation(row.location),
      city: firstOrValue(row.cities),
      amenities,
      faqs: row.areas_faqs ?? [],
      amenities_faqs: row.areas_amenities_faqs ?? [],
      property_ids: row.areas_properties?.map((item) => item.property_id) ?? [],
      properties: propertiesResponse.data ?? [],
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area fetched successfully',
      data: area,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single area by ID with related data
 */
export async function getAreaByIdAdmin(id: string): Promise<ApiResponse<AreaWithCity | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('areas')
      .select('*, cities(name, slug), areas_amenities(amenity_id), areas_properties(property_id), areas_faqs(id, question, answer), areas_amenities_faqs(id, question, answer)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Area not found',
          error: { code: 'NOT_FOUND' },
        });
      }
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area fetched successfully',
      data: data as AreaWithCity | null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get area options for admin dropdowns
 * Returns areas formatted for select components
 */
export async function getAreaOptionsAdmin(): Promise<ApiResponse<AreaOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas').select('name, slug, city_id').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Format for select dropdown
    const options: AreaOption[] = data.map((area) => ({
      label: area.name,
      value: area.slug,
      city_id: area.city_id,
    }));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
