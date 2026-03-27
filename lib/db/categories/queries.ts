'use server';
/**
 * Category Queries
 * Read operations for categories
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Category } from '@/types/property';

import { PaginatedResult } from '@/types/property';

/**
 * Get all active categories (for public dropdowns)
 */
export async function getActiveCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true });

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
      message: 'Categories fetched successfully',
      data: data as Category[],
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
 * Get all categories (admin - includes inactive)
 */
export async function getAllCategoriesAdmin() {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });

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
      message: 'Categories fetched successfully',
      data: data as Category[],
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
export async function getCategoryById(id: string) {
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
export async function getCategoryBySlug(slug: string) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).eq('is_active', true).single();

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
