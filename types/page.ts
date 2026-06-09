/**
 * Page Types
 * Domain types for content pages (Privacy Policy, Terms, Cookie Policy)
 * Based on Database['public']['Tables']['pages']['Row']
 */

import type { PaginationFilters, SearchFilters, TiptapContent } from './shared';
import type { Tables } from './db/supabase-generated';

type PageRow = Tables<'pages'>;
export type PageSEO = Tables<'pages_seo'>;

export type Page = Omit<PageRow, 'content'> & {
  content: PageContent;
  pages_seo?: PageSEO | null;
};

export type PageContent = TiptapContent;

export type PageInsert = Omit<Page, 'id' | 'created_at' | 'updated_at'>;
export type PageUpdate = Partial<Omit<PageInsert, 'slug'>>;

/**
 * Page filters for admin list page
 */
export interface PageFilters extends PaginationFilters, SearchFilters {}
