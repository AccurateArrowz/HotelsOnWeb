/**
 * Utility to extract user-friendly error messages from various types of fetch and API errors.
 * Handles:
 * - Network errors / Offline / CORS / Failed to fetch (FETCH_ERROR)
 * - Timeout errors (TIMEOUT_ERROR)
 * - Server errors (5xx)
 * - Client errors with structured backend responses ({ success: false, message: '...' })
 * - Parsing errors (PARSING_ERROR)
 * - Generic JS Errors
 */

export interface ApiErrorPayload {
  status?: number | string;
  error?: string;
  message?: string;
  data?: {
    message?: string;
    errors?: Record<string, string[]> | null;
  } | string;
}

export const SERVER_UNAVAILABLE_MESSAGE =
  'Unable to connect to the server. Please check your internet connection or try again in a while.';

export const SERVER_ERROR_MESSAGE =
  'The server encountered an error. Please try again later.';

export const isNetworkOrOfflineError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as ApiErrorPayload;
  const status = err.status;
  const combinedMessage = [err.error, err.message]
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase();

  return (
    status === 'FETCH_ERROR' ||
    status === 'TIMEOUT_ERROR' ||
    combinedMessage.includes('failed to fetch') ||
    combinedMessage.includes('networkerror') ||
    combinedMessage.includes('network error') ||
    combinedMessage.includes('network request failed') ||
    combinedMessage.includes('abort') ||
    combinedMessage.includes('load failed')
  );
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred'
): string => {
  if (!error) {
    return fallbackMessage;
  }

  // If a raw string was thrown or returned
  if (typeof error === 'string' && error.trim().length > 0) {
    return error;
  }

  const err = error as ApiErrorPayload;

  // 1. Structured backend message in err.data.message
  if (err.data && typeof err.data === 'object' && typeof err.data.message === 'string' && err.data.message.trim().length > 0) {
    return err.data.message;
  }

  // 2. String data payload (e.g. from plain text response)
  if (typeof err.data === 'string' && err.data.trim().length > 0) {
    return err.data;
  }

  // 3. Network or connection failure
  if (isNetworkOrOfflineError(error)) {
    return SERVER_UNAVAILABLE_MESSAGE;
  }

  // 4. HTTP 5xx Server Error status
  if (typeof err.status === 'number' && err.status >= 500) {
    return SERVER_ERROR_MESSAGE;
  }

  // 5. Explicit error string on the object (e.g. RTK Query or Error object)
  if (typeof err.error === 'string' && err.error.trim().length > 0) {
    return err.error;
  }

  // 6. Standard Error.message
  if (typeof err.message === 'string' && err.message.trim().length > 0) {
    return err.message;
  }

  return fallbackMessage;
};
