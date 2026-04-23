'use server';
/**
 * City Queries
 * Read operations for cities
 *
 * @fileoverview Server-side query functions for fetching city data.
 * All functions use admin client and return standardized ApiResponse.
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { City, CityOption, CityFilters } from '@/types/city';
import type { PaginatedResult } from '@/types/shared';

/**
 * Get cities with optional search and pagination
 *
 * @param filters - Optional filters (search, page, pageSize)
 * @returns Paginated list of cities
 *
 * @example
 * // Get all cities
 * const result = await getCitiesAdmin();
 *
 * @example
 * // Get paginated with search
 * const result = await getCitiesAdmin({
 *   search: 'dubai',
 *   page: 1,
 *   pageSize: 10
 * });
 */
export async function getCitiesAdmin(filters?: CityFilters): Promise<ApiResponse<PaginatedResult<City>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize; // undefined means "all"
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('cities').select('*', { count: 'exact' });

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

    const result: PaginatedResult<City> = {
      data: (data as City[]) ?? [],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Cities fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch cities';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single city by ID
 *
 * @param id - City UUID
 * @returns City data or null if not found
 *
 * @example
 * const result = await getCityById('uuid');
 */
export async function getCityById(id: string): Promise<ApiResponse<City | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('cities').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'City not found',
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
      message: 'City fetched successfully',
      data: data as City,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch city';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a city by slug
 *
 * @param slug - URL-friendly city identifier
 * @returns City data or null if not found
 *
 * @example
 * const result = await getCityBySlug('dubai');
 */
export async function getCityBySlug(slug: string): Promise<ApiResponse<City | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('cities').select('*').eq('slug', slug).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'City not found',
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
      message: 'City fetched successfully',
      data: data as City,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch city';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get city options for admin dropdowns
 *
 * Returns cities formatted for select components with "All Cities" option.
 *
 * @returns Array of city options (label, value, logo_url)
 *
 * @example
 * const result = await getCityOptionsAdmin();
 * // Returns: [{ label: 'All Cities', value: 'all' }, { label: 'Dubai', value: 'dubai', ... }]
 */
export async function getCityOptionsAdmin(): Promise<ApiResponse<CityOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('cities').select('id, name, slug, logo_url').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Format for select dropdown: cities only
    const options: CityOption[] = data.map((city) => ({ label: city.name, value: city.id, slug: city.slug, logo_url: city.logo_url }));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'City options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch city options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get cities for public-facing pages
 * Uses server client (respects RLS) - suitable for frontend components
 *
 * @param filters - Optional filters (search, page, pageSize, limit)
 * @returns Paginated list of cities
 *
 * @example
 * // Get all cities
 * const result = await getCities();
 *
 * @example
 * // Get paginated with search
 * const result = await getCities({ search: 'dubai', page: 1, limit: 10 });
 *
 * @example
 * // Get limited results (for homepage preview)
 * const result = await getCities({ limit: 6 });
 */
export async function getCities(filters?: CityFilters & { limit?: number }): Promise<ApiResponse<PaginatedResult<City>>> {
  try {
    const supabase = await serverClient();
    const page = filters?.page || 1;
    const pageSize = filters?.limit || filters?.pageSize;
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('cities').select('*', { count: 'exact' });

    // Apply search filter
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply ordering
    query = query.order('name', { ascending: true });

    // Apply pagination/limit
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

    const result: PaginatedResult<City> = {
      data: (data as City[]) ?? [],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Cities fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch cities';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get city options for public dropdowns (select components)
 * Uses server client - suitable for frontend filters, search forms
 *
 * @returns Array of city options with label/value for selects
 *
 * @example
 * // In Server Component for location filter
 * const result = await getCityOptionsPublic();
 * if (result.success) {
 *   <Select options={result.data} />
 * }
 */
export async function getCityOptions(): Promise<ApiResponse<CityOption[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('cities').select('id, name, slug, logo_url').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const options: CityOption[] = data.map((city) => ({
      label: city.name,
      value: city.id,
      slug: city.slug,
      logo_url: city.logo_url,
    }));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'City options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch city options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
