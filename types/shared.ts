/**
 * Shared Types
 * Common types used across the application
 */

import { ImageObject } from './images';

/**
 * Generic paginated result for list endpoints
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Generic filter interface for pagination
 */
export interface PaginationFilters {
  page?: number;
  pageSize?: number;
}

/**
 * Generic search filter interface
 */
export interface SearchFilters {
  search?: string;
}

/**
 * Generic select option for dropdowns
 * Can be extended by entity-specific options (e.g., CitySelectOption, CategorySelectOption)
 */
export interface SelectOption {
  label: string;
  value: string;
  logo_url?: string | ImageObject | null;
}

/**
 * Tiptap JSON content structure stored in rich-text content columns.
 */
export interface TiptapContent {
  type: 'doc';
  content: TiptapContentNode[];
}

export interface TiptapContentNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapContentNode[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
}

/**
 * Generic Location type with coordinates
 * Used across different entities (Area, Property, etc.)
 */
export type Location = {
  lng: number;
  lat: number;
};

/**
 * Generic FAQ type
 * Used across different entities (Area, Property, etc.)
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at?: string;
}

/**
 * Generic FAQ insert type (without id and created_at)
 */
export type FAQInsert = Omit<FAQ, 'id' | 'created_at'>;
