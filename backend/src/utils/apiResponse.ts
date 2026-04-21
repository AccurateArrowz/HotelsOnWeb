import { Response } from 'express';
import {
  type SuccessResponse,
  type ErrorResponse,
  type ErrorDetail,
} from '@hotelsonweb/shared';

type SendSuccessOptions<T> = Omit<SuccessResponse<T>, 'success'>;

type SendErrorOptions = Omit<ErrorResponse, 'success'>;


export const sendSuccess = <T>(
  res: Response,
  options: SendSuccessOptions<T>,
  statusCode: number = 200
): Response => {
  const responseBody: SuccessResponse<T> = {
    success: true,
    ...options,
  };

  return res.status(statusCode).json(responseBody);
};


/**
 * Send an error response
 * @param res - Express Response object
 * @param options - Error response options object
 */
export const sendError = (
  res: Response,
  options: SendErrorOptions,
  statusCode: number = 500
): Response => {

  const responseBody: ErrorResponse = {
    success: false,
    ...options,
  };

  return res.status(statusCode).json(responseBody);
};

/**
 * Send a validation error response
 */
export const sendValidationError = (
  res: Response,
  message: string = 'Validation failed',
  errors: ErrorDetail[] = []
): Response => {
  return sendError(res, { message, errors }, 400);
};

/**
 * Send a not found error response
 */
export const sendNotFound = (res: Response, message: string = 'Resource not found'): Response => {
  return sendError(res, { message }, 404);
};

/**
 * Send an unauthorized error response
 */
export const sendUnauthorized = (res: Response, message: string = 'Unauthorized'): Response => {
  return sendError(res, { message }, 401);
};

/**
 * Send a forbidden error response
 */
export const sendForbidden = (res: Response, message: string = 'Forbidden'): Response => {
  return sendError(res, { message }, 403);
};

/**
 * Send a bad request error response
 */
export const sendBadRequest = (res: Response, message: string = 'Bad request'): Response => {
  return sendError(res, { message }, 400);
};

/**
 * Send a conflict error response
 */
export const sendConflict = (res: Response, message: string = 'Conflict'): Response => {
  return sendError(res, { message }, 409);
};

/**
 * Send an internal server error response
 */
export const sendInternalError = (
  res: Response,
  message: string = 'Internal server error'
): Response => {
  return sendError(res, { message }, 500);
};
