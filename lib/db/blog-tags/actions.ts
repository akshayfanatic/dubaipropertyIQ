'use server';
/**
 * Blog tag write operations.
 */

import { refresh, revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { BlogTag } from '@/types/blog-tag';
import type { BlogTagInsertData, BlogTagUpdateData } from '@/lib/validations/blog-tag';

export type BlogTagInsert = BlogTagInsertData;
export type BlogTagUpdate = BlogTagUpdateData;

export async function createBlogTag(tag: BlogTagInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_tags').insert(tag).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/blog-tags');
    refresh();

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Blog tag created successfully',
      data: data as BlogTag,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create blog tag';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function updateBlogTag(id: string, updates: BlogTagUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blog_tags').update(updates).eq('id', id).select().single();

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
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/blog-tags');
    refresh();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog tag updated successfully',
      data: data as BlogTag,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update blog tag';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function deleteBlogTag(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('blog_tags').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/blog-tags');
    refresh();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog tag deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete blog tag';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
