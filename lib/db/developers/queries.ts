'use server';
/**
 * Developer Queries
 * Read operations for developers
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Developer, DeveloperFilters, DeveloperOption } from '@/types/developer';
import type { PaginatedResult } from '@/types/shared';

const normalizeDeveloper = (data: { developers_seo?: unknown } & Record<string, unknown>) => ({
  ...data,
  developers_seo: Array.isArray(data.developers_seo) ? (data.developers_seo[0] ?? null) : (data.developers_seo ?? null),
});

/**
 * Get developers with optional search and pagination
 */
export async function getDevelopersAdmin(filters?: DeveloperFilters): Promise<ApiResponse<PaginatedResult<Developer>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const from = (page - 1) * pageSize;

    let query = supabase.from('developers').select('*, developers_seo(*)', { count: 'exact' });

    // Apply search filter
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply ordering
    query = query.order('name', { ascending: true });

    // Apply pagination
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const result: PaginatedResult<Developer> = {
      data: ((data ?? []).map((developer) => normalizeDeveloper(developer)) as Developer[]) ?? [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Developers fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch developers';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single developer by ID
 */
export async function getDeveloperById(id: string): Promise<ApiResponse<Developer | null>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('developers').select('*, developers_seo(*)').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Developer not found',
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
      message: 'Developer fetched successfully',
      data: normalizeDeveloper(data) as Developer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch developer';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a developer by slug
 */
export async function getDeveloperBySlug(slug: string): Promise<ApiResponse<Developer | null>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('developers').select('*, developers_seo(*)').eq('slug', slug).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Developer not found',
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
      message: 'Developer fetched successfully',
      data: normalizeDeveloper(data) as Developer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch developer';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get developer options for admin dropdowns
 */
export async function getDeveloperOptionsAdmin(): Promise<ApiResponse<DeveloperOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('developers').select('id, name,logo_url').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const options: DeveloperOption[] = [...data.map((dev) => ({ label: dev.name, value: dev.id, logo_url: dev.logo_url }))];

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Developer options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch developer options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get developers for public-facing pages
 * Uses server client (respects RLS) - suitable for frontend components
 */
export async function getDevelopers(): Promise<ApiResponse<Developer[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('developers').select('*, developers_seo(*)').order('name', { ascending: true });

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
      message: 'Developers fetched successfully',
      data: ((data ?? []).map((developer) => normalizeDeveloper(developer)) as Developer[]) ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch developers';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
