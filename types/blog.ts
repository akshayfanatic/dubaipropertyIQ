/**
 * Blog Types
 * Domain types for blog posts.
 */

import type { PaginationFilters, SearchFilters, TiptapContent } from './shared';
import type { ImageObject } from './images';
import type { Tables } from './db/supabase-generated';

type BlogRow = Tables<'blogs'>;
export type BlogSEO = Tables<'blogs_seo'>;

export type Blog = Omit<BlogRow, 'content' | 'feature_image_url'> & {
  content: BlogContent;
  feature_image_url: ImageObject | null;
  blogs_seo?: BlogSEO | null;
};

export type BlogContent = TiptapContent;

export type BlogInsert = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;
export type BlogUpdate = Partial<Omit<BlogInsert, 'slug'>>;

/**
 * Blog filters for admin list page
 */
export interface BlogFilters extends PaginationFilters, SearchFilters {}
