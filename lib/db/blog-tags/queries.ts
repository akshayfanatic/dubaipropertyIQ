'use server';
/**
 * Blog tag read operations.
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { BlogTag, BlogTagFilters, BlogTagOption } from '@/types/blog-tag';
import type { PaginatedResult } from '@/types/shared';

export async function getBlogTagsAdmin(filters?: BlogTagFilters): Promise<ApiResponse<PaginatedResult<BlogTag>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize;
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('blog_tags').select('*', { count: 'exact' });

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

    const result: PaginatedResult<BlogTag> = {
      data: (data as BlogTag[]) ?? [],
      total: count || 0,
      page,
      pageSize: pageSize || count || 0,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog tags fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog tags';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getBlogTagById(id: string): Promise<ApiResponse<BlogTag | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_tags').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Blog tag not found',
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
      message: 'Blog tag fetched successfully',
      data: data as BlogTag,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog tag';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getBlogTagOptionsAdmin(): Promise<ApiResponse<BlogTagOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_tags').select('id, name').order('name', { ascending: true });

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
      message: 'Blog tag options fetched successfully',
      data: (data ?? []).map((tag) => ({ label: tag.name, value: tag.id })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog tag options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function getBlogTagOptions(): Promise<ApiResponse<BlogTagOption[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase.from('blog_tags').select('id, name').order('name', { ascending: true });

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
      message: 'Blog tag options fetched successfully',
      data: (data ?? []).map((tag) => ({ label: tag.name, value: tag.id })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog tag options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
