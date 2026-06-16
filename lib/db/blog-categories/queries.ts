'use server';
/**
 * Blog category read operations.
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { BlogCategory, BlogCategoryFilters, BlogCategoryOption } from '@/types/blog-category';
import type { PaginatedResult } from '@/types/shared';

export async function getBlogCategoriesAdmin(filters?: BlogCategoryFilters): Promise<ApiResponse<PaginatedResult<BlogCategory>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize;
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('blog_categories').select('*', { count: 'exact' });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    query = query.order('name', { ascending: true });

    if (pageSize) {
      query = query.range(from, from + pageSize - 1);
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

    const result: PaginatedResult<BlogCategory> = {
      data: (data as BlogCategory[]) ?? [],
      total: count || 0,
      page,
      pageSize: pageSize || count || 0,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog categories fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog categories';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getBlogCategoryById(id: string): Promise<ApiResponse<BlogCategory | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_categories').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Blog category not found',
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
      message: 'Blog category fetched successfully',
      data: data as BlogCategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getBlogCategoryOptionsAdmin(): Promise<ApiResponse<BlogCategoryOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_categories').select('id, name').eq('is_active', true).order('name', { ascending: true });

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
      message: 'Blog category options fetched successfully',
      data: (data ?? []).map((category) => ({ label: category.name, value: category.id })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog category options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getBlogCategoryOptions(): Promise<ApiResponse<BlogCategoryOption[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('blog_categories').select('id, name').eq('is_active', true).order('name', { ascending: true });

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
      message: 'Blog category options fetched successfully',
      data: (data ?? []).map((category) => ({ label: category.name, value: category.id })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog category options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
