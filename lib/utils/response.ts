/**
 * API Response Factory
 * Consistent response format for frontend-backend communication
 */

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  error?: {
    code: string;
    details?: string;
  };
}

/**
 * Common HTTP status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

/**
 * Create a consistent API response
 */
export const ApiResponse = <T>(params: {
  success: boolean;
  status: number;
  message: string;
  data?: T | null;
  error?: {
    code: string;
    details?: string;
  };
}): ApiResponse<T> => ({
  success: params.success,
  status: params.status,
  message: params.message,
  data: params.data ?? null,
  error: params.error,
});
