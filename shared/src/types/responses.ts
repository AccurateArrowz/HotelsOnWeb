/**
 * Standard API Response Types
 * Used for type-safe response handling across frontend and backend
 */

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  meta?: Record<string, any>;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ErrorDetail[];
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

