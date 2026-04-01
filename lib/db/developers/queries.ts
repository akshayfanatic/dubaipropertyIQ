'use server';
/**
 * Developer Queries
 * Read operations for developers
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Developer, DeveloperFilters, DeveloperOption } from '@/types/developer';
import { calculateTrustScore } from '@/lib/utils';
import type { PaginatedResult } from '@/types/shared';

/**
 * Get developers with optional search and pagination
 */
export async function getDevelopersAdmin(filters?: DeveloperFilters): Promise<ApiResponse<PaginatedResult<Developer>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const from = (page - 1) * pageSize;

    let query = supabase.from('developers').select('*', { count: 'exact' });

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
      data: data as Developer[],
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
    const supabase = adminClient();

    const { data, error } = await supabase.from('developers').select('*').eq('id', id).single();

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
      data: data as Developer,
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
    const supabase = adminClient();

    const { data, error } = await supabase.from('developers').select('*').eq('slug', slug).single();

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
      data: data as Developer,
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
 * Get developer with computed trust score
 */
export async function getDeveloperWithTrustScore(id: string): Promise<ApiResponse<(Developer & { trust_score: number }) | null>> {
  const result = await getDeveloperById(id);

  if (!result.success || !result.data) {
    return result as ApiResponse<null>;
  }

  const developer = result.data;
  return ApiResponse({
    success: true,
    status: HttpStatus.OK,
    message: 'Developer fetched successfully',
    data: {
      ...developer,
      trust_score: calculateTrustScore(developer),
    },
  });
}

/**
 * Get developer stats for dashboard
 */
export async function getDeveloperStatsAdmin(): Promise<ApiResponse<{ total: number; withHighTrust: number }>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('developers').select('delivery_timeliness_score, service_charge_score, build_quality_score, after_sales_score');

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const developers = data as Pick<Developer, 'delivery_timeliness_score' | 'service_charge_score' | 'build_quality_score' | 'after_sales_score'>[];
    const withHighTrust = developers.filter((d) => calculateTrustScore(d) >= 70).length;

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Developer stats fetched successfully',
      data: {
        total: developers.length,
        withHighTrust,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch developer stats';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
