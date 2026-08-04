import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../common/http-error';
import { ApiResponseHandler } from '../common/api-response';

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorMiddleware = (
  error: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[ERROR]', error);

  // Handle custom HttpError
  if (error instanceof HttpError) {
    return ApiResponseHandler.error(res, error.message, error.statusCode, error.details);
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return ApiResponseHandler.validationError(res, error.message);
  }

  // Handle database errors
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return ApiResponseHandler.validationError(res, 'Validation failed', [
      { message: error.message },
    ]);
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return ApiResponseHandler.unauthorized(res, 'Invalid token');
  }

  if (error.name === 'TokenExpiredError') {
    return ApiResponseHandler.unauthorized(res, 'Token expired');
  }

  // Default error response
  return ApiResponseHandler.internalError(res, 'An unexpected error occurred');
};

/**
 * Async error wrapper for route handlers
 * Wraps async functions to catch errors and pass to error middleware
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
