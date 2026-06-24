'use server';
/**
 * Blog Queries
 * Read operations for blogs
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Blog, BlogFilters } from '@/types/blog';
import type { PaginatedResult } from '@/types/shared';

const BLOG_SELECT = '*, blogs_seo(*), blog_categories(id, name, slug), blog_post_tags(tag_id, blog_tags(id, name, slug))';

const normalizeBlog = (data: { blogs_seo?: unknown } & Record<string, unknown>) => ({
  ...data,
  blogs_seo: Array.isArray(data.blogs_seo) ? (data.blogs_seo[0] ?? null) : (data.blogs_seo ?? null),
});

export type BlogStats = {
  blogs: number;
  categories: number;
  tags: number;
};

/**
 * Get blog library totals for the public blog listing header.
 */
export async function getBlogStats(): Promise<ApiResponse<BlogStats>> {
  try {
    const supabase = adminClient();

    const [blogsResult, categoriesResult, tagsResult] = await Promise.all([
      supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('blog_categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('blog_tags').select('id', { count: 'exact', head: true }),
    ]);

    const error = blogsResult.error ?? categoriesResult.error ?? tagsResult.error;

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'BLOG_STATS_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog stats fetched successfully',
      data: {
        blogs: blogsResult.count ?? 0,
        categories: categoriesResult.count ?? 0,
        tags: tagsResult.count ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog stats';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get all blogs with optional search and pagination
 * - No pageSize -> returns all blogs (no pagination limit)
 * - With pageSize -> applies pagination
 * Uses adminClient - hence Admin suffix
 */
export async function getBlogsAdmin(filters?: BlogFilters): Promise<ApiResponse<PaginatedResult<Blog>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize;
    const from = pageSize ? (page - 1) * pageSize : 0;

    let query = supabase.from('blogs').select(BLOG_SELECT, { count: 'exact' });

    // Apply search filter
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
    }

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.tag_ids?.length) {
      const { data: taggedRows, error: tagError } = await supabase.from('blog_post_tags').select('blog_id').in('tag_id', filters.tag_ids);

      if (tagError) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: tagError.message,
          error: { code: tagError.code || 'TAG_FILTER_ERROR' },
        });
      }

      const blogIds = Array.from(new Set((taggedRows ?? []).map((row) => row.blog_id)));

      if (!blogIds.length) {
        const emptyResult: PaginatedResult<Blog> = {
          data: [],
          total: 0,
          page,
          pageSize: pageSize || 0,
          totalPages: 0,
        };

        return ApiResponse({
          success: true,
          status: HttpStatus.OK,
          message: 'Blogs fetched successfully',
          data: emptyResult,
        });
      }

      query = query.in('id', blogIds);
    }

    if (filters?.status === 'published') {
      query = query.eq('is_published', true);
    }

    if (filters?.status === 'draft') {
      query = query.eq('is_published', false);
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

    const result: PaginatedResult<Blog> = {
      data: ((data ?? []).map((blog) => normalizeBlog(blog)) as Blog[]) ?? [],
      total: count || 0,
      page,
      pageSize: effectivePageSize,
      totalPages: pageSize ? Math.ceil((count || 0) / pageSize) : 1,
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blogs fetched successfully',
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blogs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get published blogs with optional public filters.
 */
export async function getBlogs(filters?: BlogFilters): Promise<ApiResponse<Blog[]>> {
  try {
    const supabase = adminClient();
    let query = supabase.from('blogs').select(BLOG_SELECT).eq('is_published', true);

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`);
    }

    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.tag_ids?.length) {
      const { data: taggedRows, error: tagError } = await supabase.from('blog_post_tags').select('blog_id').in('tag_id', filters.tag_ids);

      if (tagError) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: tagError.message,
          error: { code: tagError.code || 'TAG_FILTER_ERROR' },
        });
      }

      const blogIds = Array.from(new Set((taggedRows ?? []).map((row) => row.blog_id)));

      if (!blogIds.length) {
        return ApiResponse({
          success: true,
          status: HttpStatus.OK,
          message: 'Blogs fetched successfully',
          data: [],
        });
      }

      query = query.in('id', blogIds);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

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
      message: 'Blogs fetched successfully',
      data: (data ?? []).map((blog) => normalizeBlog(blog)) as Blog[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blogs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get published blogs only (for frontend)
 */
export async function getPublishedBlogs(): Promise<ApiResponse<Blog[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blogs').select(BLOG_SELECT).eq('is_published', true).order('created_at', { ascending: false });

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
      message: 'Published blogs fetched successfully',
      data: (data ?? []).map((blog) => normalizeBlog(blog)) as Blog[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch published blogs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single blog by ID
 */
export async function getBlogById(id: string): Promise<ApiResponse<Blog | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blogs').select(BLOG_SELECT).eq('id', id).single();

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
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog fetched successfully',
      data: normalizeBlog(data) as Blog,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a blog by slug (for frontend display)
 */
export async function getBlogBySlug(slug: string): Promise<ApiResponse<Blog | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('blogs').select(BLOG_SELECT).eq('slug', slug).eq('is_published', true).single();

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
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Blog fetched successfully',
      data: normalizeBlog(data) as Blog,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch blog';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
