'use server';
/**
 * Area Queries
 * Read operations for areas
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Area, AreaOption, AreaFilters, AreaFAQ, AreaAmenityFAQ } from '@/types/areas';
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

/**
 * Get areas with optional search and pagination
 * - No pageSize → returns all areas (no pagination limit)
 * - With pageSize → applies pagination
 * Uses adminClient - hence Admin suffix
 */
export async function getAreasAdmin(filters?: AreaFilters): Promise<ApiResponse<PaginatedResult<Area>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize; // undefined means "all"
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('areas').select('*', { count: 'exact' });

    // Apply city filter
    if (filters?.city_id) {
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

    const result: PaginatedResult<Area> = {
      data: data as Area[],
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
 * Get a area by slug
 */
export async function getAreaBySlug(slug: string): Promise<ApiResponse<Area | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas').select('*').eq('slug', slug).single();

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
      data: data as Area,
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

/**
 * Get area FAQs
 */
export async function getAreaFAQsAdmin(areaId: string): Promise<ApiResponse<AreaFAQ[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_faqs').select('*').eq('area_id', areaId).order('created_at', { ascending: true });

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
      message: 'Area FAQs fetched successfully',
      data: data as AreaFAQ[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area FAQs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get area amenities FAQs
 */
export async function getAreaAmenitiesFAQs(areaId: string): Promise<ApiResponse<AreaAmenityFAQ[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_amenities_faqs').select('*').eq('area_id', areaId).order('created_at', { ascending: true });

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
      message: 'Area amenities FAQs fetched successfully',
      data: data as AreaAmenityFAQ[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area amenities FAQs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get area amenities (amenity IDs)
 */
export async function getAreaAmenityIds(areaId: string): Promise<ApiResponse<string[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_amenities').select('amenity_id').eq('area_id', areaId);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const amenityIds = data?.map((item) => item.amenity_id) || [];

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area amenities fetched successfully',
      data: amenityIds,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area amenities';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get area properties (property IDs)
 */
export async function getAreaPropertyIds(areaId: string): Promise<ApiResponse<string[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_properties').select('property_id').eq('area_id', areaId);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const propertyIds = data?.map((item) => item.property_id) || [];

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area properties fetched successfully',
      data: propertyIds,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch area properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
