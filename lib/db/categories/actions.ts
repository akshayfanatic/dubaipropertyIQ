'use server';
/**
 * Category Actions
 * Write operations for categories (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Category } from '@/types/property';
import { revalidatePath } from 'next/cache';

/**
 * Category insert type (for creating new categories)
 */
export interface CategoryInsert {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order?: number;
  is_active?: boolean;
}

/**
 * Category update type (for partial updates)
 */
export type CategoryUpdate = Partial<CategoryInsert>;

/**
 * Create a new category
 */
export async function createCategory(category: CategoryInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').insert(category).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate categories cache
    revalidatePath('/admin/categories');

    revalidatePath('/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Category created successfully',
      data: data as Category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(id: string, updates: CategoryUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();

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
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    // Revalidate categories cache
    revalidatePath('/admin/categories');
    revalidatePath('/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Category updated successfully',
      data: data as Category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  try {
    const supabase = adminClient();

    // Check if category has properties assigned
    const { data: propertiesWithCategory } = await supabase.from('properties').select('id').eq('category_id', id).limit(1);

    if (propertiesWithCategory && propertiesWithCategory.length > 0) {
      return ApiResponse({
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'Cannot delete category with assigned properties',
        error: { code: 'CATEGORY_IN_USE' },
      });
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate categories cache
    revalidatePath('/admin/categories');
    revalidatePath('/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
