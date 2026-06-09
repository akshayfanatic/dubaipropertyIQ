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

function splitBlogSEO<T extends BlogInsertAction | BlogUpdateAction>(blog: T) {
  const { meta_title, meta_description, ...blogData } = blog;

  return {
    blogData,
    seoData: {
      meta_title: meta_title || null,
      meta_description: meta_description || null,
    },
  };
}

/**
 * Create a new blog
 */
export async function createBlog(blog: BlogInsertAction) {
  try {
    const supabase = adminClient();
    const { blogData, seoData } = splitBlogSEO(blog);

    const { data, error } = await supabase.from('blogs').insert(blogData).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    const { error: seoError } = await supabase.from('blogs_seo').upsert(
      {
        blog_id: data.id,
        ...seoData,
      },
      { onConflict: 'blog_id' },
    );

    if (seoError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: seoError.message,
        error: { code: seoError.code || 'SEO_UPSERT_ERROR' },
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
    const { blogData, seoData } = splitBlogSEO(updates);

    const { data, error } = await supabase.from('blogs').update(blogData).eq('id', id).select().single();

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

    const { error: seoError } = await supabase.from('blogs_seo').upsert(
      {
        blog_id: id,
        ...seoData,
      },
      { onConflict: 'blog_id' },
    );

    if (seoError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: seoError.message,
        error: { code: seoError.code || 'SEO_UPSERT_ERROR' },
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
