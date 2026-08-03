/**
 * Standard API Response Types
 * Used for type-safe response handling across frontend and backend
 */

/**
 * Error detail for validation or business logic errors
 */
export interface ErrorDetail {
  field: string;
  message: string;
}

/**
 * Success response with optional data and metadata
 */
export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

/**
 * Error response with optional error details
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ErrorDetail[];
}

/**
 * Union type for any API response
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

