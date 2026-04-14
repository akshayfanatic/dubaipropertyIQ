'use server';
/**
 * Amenity Queries
 * Read operations for amenities
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Amenity, AmenityOption, AmenityFilters } from '@/types/amenities';
import type { PaginatedResult } from '@/types/shared';

/**
 * Get amenities with optional search and pagination
 * - No pageSize → returns all amenities (no pagination limit)
 * - With pageSize → applies pagination
 * Uses adminClient - hence Admin suffix
 */
export async function getAmenitiesAdmin(filters?: AmenityFilters): Promise<ApiResponse<PaginatedResult<Amenity>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize; // undefined means "all"
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('amenities').select('*', { count: 'exact' });

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

    const result: PaginatedResult<Amenity> = {
      data: (data as Amenity[]) ?? [],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Amenities fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch amenities';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single amenity by ID
 */
export async function getAmenityById(id: string): Promise<ApiResponse<Amenity | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('amenities').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Amenity not found',
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
      message: 'Amenity fetched successfully',
      data: data as Amenity,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch amenity';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a amenity by slug
 */
export async function getAmenityBySlug(slug: string): Promise<ApiResponse<Amenity | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('amenities').select('*').eq('slug', slug).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Amenity not found',
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
      message: 'Amenity fetched successfully',
      data: data as Amenity,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch amenity';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get amenity options for admin dropdowns
 * Returns amenities formatted for select components
 */
export async function getAmenityOptionsAdmin(): Promise<ApiResponse<AmenityOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('amenities').select('name, id, logo_url').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Format for select dropdown
    const options: AmenityOption[] = data.map((amenity) => ({
      label: amenity.name,
      value: amenity.id,
      logo_url: amenity.logo_url,
    }));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Amenity options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch amenity options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
