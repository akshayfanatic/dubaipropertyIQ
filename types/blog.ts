/**
 * Blog Types
 * Domain types for blog posts.
 */

import type { PaginationFilters, SearchFilters, TiptapContent } from './shared';
import type { ImageObject } from './images';
import type { Tables } from './db/supabase-generated';

type BlogRow = Tables<'blogs'>;
export type BlogSEO = Tables<'blogs_seo'>;
export type BlogCategorySummary = Pick<Tables<'blog_categories'>, 'id' | 'name' | 'slug'>;
export type BlogTagSummary = Pick<Tables<'blog_tags'>, 'id' | 'name' | 'slug'>;
export type BlogPostTag = Tables<'blog_post_tags'> & {
  blog_tags?: BlogTagSummary | null;
};

export type Blog = Omit<BlogRow, 'content' | 'feature_image_url'> & {
  content: BlogContent;
  feature_image_url: ImageObject | null;
  blogs_seo?: BlogSEO | null;
  blog_categories?: BlogCategorySummary | null;
  blog_post_tags?: BlogPostTag[];
};

export type BlogContent = TiptapContent;

export type BlogInsert = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;
export type BlogUpdate = Partial<Omit<BlogInsert, 'slug'>>;

/**
 * Blog filters for admin list page
 */
export type BlogPublishStatusFilter = 'published' | 'draft' | 'all';

export interface BlogFilters extends PaginationFilters, SearchFilters {
  category_id?: string;
  status?: BlogPublishStatusFilter;
  tag_ids?: string[];
}
