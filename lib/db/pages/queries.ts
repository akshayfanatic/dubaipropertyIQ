'use server';
/**
 * Page Queries
 * Read operations for pages
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Page, PageFilters } from '@/types/page';
import type { PaginatedResult } from '@/types/shared';

/**
 * Get all pages with optional search and pagination
 * - No pageSize → returns all pages (no pagination limit)
 * - With pageSize → applies pagination
 * Uses adminClient - hence Admin suffix
 */
export async function getPagesAdmin(filters?: PageFilters): Promise<ApiResponse<PaginatedResult<Page>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize;
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('pages').select('*', { count: 'exact' });

    // Apply search filter
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
    }

    // Apply ordering
    query = query.order('created_at', { ascending: false });

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

    const result: PaginatedResult<Page> = {
      data: (data as Page[]) ?? [],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Pages fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pages';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get published pages only (for frontend)
 */
export async function getPublishedPages(): Promise<ApiResponse<Page[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('pages').select('*').eq('is_published', true).order('title', { ascending: true });

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
      message: 'Published pages fetched successfully',
      data: data as Page[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch published pages';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single page by ID
 */
export async function getPageById(id: string): Promise<ApiResponse<Page | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Page not found',
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
      message: 'Page fetched successfully',
      data: data as Page,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch page';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a page by slug (for frontend display)
 */
export async function getPageBySlug(slug: string): Promise<ApiResponse<Page | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).eq('is_published', true).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Page not found',
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
      message: 'Page fetched successfully',
      data: data as Page,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch page';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
