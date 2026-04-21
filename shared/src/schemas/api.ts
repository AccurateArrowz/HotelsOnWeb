export interface SuccessResponse<T = unknown, M = Record<string, unknown>> {
  readonly success: true;
  message?: string;
  data: T;
  meta?: M;
}

export interface ErrorDetail {
  field?: string;
  message: string; //human readable
}

export interface ErrorResponse {
  readonly success: false;
  message: string; //top level message (summary message for validation errors)
  code?: string; // e.g. "VALIDATION_ERROR", "UNAUTHORIZED"
  errors?: ErrorDetail[];
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;