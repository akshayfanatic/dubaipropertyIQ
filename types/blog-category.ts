/**
 * Blog category domain types.
 */

import type { Tables } from './db/supabase-generated';
import type { PaginationFilters, SearchFilters, SelectOption } from './shared';

export type BlogCategory = Tables<'blog_categories'>;

export type BlogCategoryInsert = Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>;
export type BlogCategoryUpdate = Partial<BlogCategoryInsert>;

export type BlogCategoryOption = SelectOption;

export interface BlogCategoryFilters extends PaginationFilters, SearchFilters {}
