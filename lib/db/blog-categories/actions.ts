'use server';
/**
 * Blog category write operations.
 */

import { refresh, revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { BlogCategory } from '@/types/blog-category';
import type { BlogCategoryInsertData, BlogCategoryUpdateData } from '@/lib/validations/blog-category';

export type BlogCategoryInsert = BlogCategoryInsertData;
export type BlogCategoryUpdate = BlogCategoryUpdateData;

export async function createBlogCategory(category: BlogCategoryInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_categories').insert(category).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/blog-categories');
    refresh();

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Blog category created successfully',
      data: data as BlogCategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create blog category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function updateBlogCategory(id: string, updates: BlogCategoryUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_categories').update(updates).eq('id', id).select().single();

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
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/blog-categories');
    refresh();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog category updated successfully',
      data: data as BlogCategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update blog category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function deleteBlogCategory(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('blog_categories').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/blog-categories');
    refresh();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog category deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete blog category';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
