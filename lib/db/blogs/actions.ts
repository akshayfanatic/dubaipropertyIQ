/**
 * Blog Actions
 * Write operations for blogs (Create, Update, Delete)
 */

'use server';

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Blog } from '@/types/blog';
import { BlogInsertData, BlogUpdateData } from '@/lib/validations/blog';
import { revalidatePath } from 'next/cache';

export type BlogInsertAction = BlogInsertData;
export type BlogUpdateAction = BlogUpdateData;

/**
 * Create a new blog
 */
export async function createBlog(blog: BlogInsertAction) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blogs').insert(blog).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/blogs');
    revalidatePath('/blogs/[slug]');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Blog created successfully',
      data: data as Blog,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create blog';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing blog
 */
export async function updateBlog(id: string, updates: BlogUpdateAction) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blogs').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Blog not found',
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

    // Revalidate cache
    revalidatePath('/dashboard/admin/blogs');
    revalidatePath('/blogs/[slug]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog updated successfully',
      data: data as Blog,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update blog';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('blogs').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/blogs');
    revalidatePath('/blogs/[slug]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete blog';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
