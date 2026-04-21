// import { SuccessResponse } from "@hotelsonweb/shared"

type SuccessResponse<T> = {
    success: true,
    data: T, 
    message: string,
    meta?: Record<string, unknown>
}

type ApiError = {
  code: string;          // machine-readable, e.g. "USER_NOT_FOUND"
  message: string;       // human-readable
  field?: string | null; // present for validation errors, null otherwise
};

type ErrorResponse<T> = {
    success: false,
    statusCode: number,
    message: string,
    errors: ApiError[]
}

const sendSuccess = <T> ({data, message, meta}: {data: T, message: string, meta?: Record<string, unknown> }):  SuccessResponse<T> => {
    return { success: true,
    data, 
    message,
    meta}
}

