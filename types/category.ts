/**
 * Category Types
 * Types for property categories in DubaiPropertyIQ
 */

import type { PaginationFilters, SearchFilters, SelectOption } from './shared';
import type { ImageObject } from './images';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url: ImageObject | null;
  created_at: string;
  updated_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

/**
 * Category option for select dropdowns
 */
export type CategoryOption = SelectOption & {
  logo_url?: ImageObject | null;
};

/**
 * Category filters for admin list page
 * Extends shared pagination and search filters
 */
export interface CategoryFilters extends PaginationFilters, SearchFilters {}

/**
 * Fixed ID for the default "Uncategorized" category
 * This category cannot be edited or deleted
 */
export const UNCATEGORIZED_CATEGORY_ID = '00000000-0000-0000-0000-000000000001';
