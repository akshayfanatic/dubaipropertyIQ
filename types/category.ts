/**
 * Category Types
 * Types for property categories in DubaiPropertyIQ
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

/**
 * Fixed ID for the default "Uncategorized" category
 * This category cannot be edited or deleted
 */
export const UNCATEGORIZED_CATEGORY_ID = '00000000-0000-0000-0000-000000000001';
