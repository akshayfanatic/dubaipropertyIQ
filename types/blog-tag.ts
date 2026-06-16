/**
 * Blog tag domain types.
 */

import type { Tables } from './db/supabase-generated';
import type { PaginationFilters, SearchFilters, SelectOption } from './shared';

export type BlogTag = Tables<'blog_tags'>;

export type BlogTagInsert = Omit<BlogTag, 'id' | 'created_at' | 'updated_at'>;
export type BlogTagUpdate = Partial<BlogTagInsert>;

export type BlogTagOption = SelectOption;

export interface BlogTagFilters extends PaginationFilters, SearchFilters {}
