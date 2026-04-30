'use server';
/**
 * Category Queries
 * Read operations for categories
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Category, CategoryOption, CategoryFilters } from '@/types/category';
import type { PaginatedResult } from '@/types/shared';

/**
 * Get categories with optional search and pagination
 * - No pageSize → returns all categories (no pagination limit)
 * - With pageSize → applies pagination
 * Uses adminClient - hence Admin suffix
 */
export async function getCategoriesAdmin(filters?: CategoryFilters): Promise<ApiResponse<PaginatedResult<Category>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize; // undefined means "all"
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('categories').select('*', { count: 'exact' });

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

    const result: PaginatedResult<Category> = {
      data: (data as Category[]) ?? [],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Categories fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<ApiResponse<Category | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Category not found',
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
      message: 'Category fetched successfully',
      data: data as Category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Category not found',
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
      message: 'Category fetched successfully',
      data: data as Category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get category options for public use
 * Uses serverClient - respects RLS, accessible to all users
 */
export async function getCategoriesOptions(): Promise<ApiResponse<CategoryOption[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('categories').select('id, name, slug, logo_url').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const options: CategoryOption[] = data.map((cat) => ({
      label: cat.name,
      value: cat.id,
      logo_url: cat.logo_url,
    }));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Category options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch category options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get category options for admin dropdowns
 * Returns categories formatted for select components
 */
export async function getCategoryOptionsAdmin(): Promise<ApiResponse<CategoryOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').select('id, name, slug, logo_url').order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Format for select dropdown: All Categories + actual categories
    const options: CategoryOption[] = [...data.map((cat) => ({ label: cat.name, value: cat.id, logo_url: cat.logo_url }))];

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Category options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch category options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
