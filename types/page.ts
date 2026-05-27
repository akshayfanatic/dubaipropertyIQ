/**
 * Page Types
 * Domain types for content pages (Privacy Policy, Terms, Cookie Policy)
 * Based on Database['public']['Tables']['pages']['Row']
 */

import type { PaginationFilters, SearchFilters, TiptapContent } from './shared';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageContent;
  excerpt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type PageContent = TiptapContent;

export type PageInsert = Omit<Page, 'id' | 'created_at' | 'updated_at'>;
export type PageUpdate = Partial<Omit<PageInsert, 'slug'>>;

/**
 * Page filters for admin list page
 */
export interface PageFilters extends PaginationFilters, SearchFilters {}
