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
