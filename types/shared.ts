/**
 * Shared Types
 * Common types used across the application
 */

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
