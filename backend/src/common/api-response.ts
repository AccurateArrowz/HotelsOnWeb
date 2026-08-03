import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '@hotelsonweb/shared';

/**
 * Typed API response handlers using shared response types
 */
export class ApiResponseHandler {
  /**
   * Send a success response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a success response with pagination metadata
   */
  static successWithPagination<T>(
    res: Response,
    data: T[],
    message: string = 'Success',
    pagination: { total: number; page: number; limit: number; pages: number },
    statusCode: number = 200
  ): Response {
    const response: SuccessResponse<T[]> = {
      success: true,
      message,
      data,
      meta: { pagination },
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T>(res: Response, data: T, message: string = 'Created'): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    const response: ErrorResponse = {
      success: false,
      message,
      ...(errors && { errors: errors.map(e => ({ field: e.field || '', message: e.message })) }),
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a validation error response (400)
   */
  static validationError(
    res: Response,
    message: string = 'Validation failed',
    errors?: Array<{ field?: string; message: string }>
  ): Response {
    return this.error(res, message, 400, errors);
  }

  /**
   * Send a not found response (404)
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  /**
   * Send an unauthorized response (401)
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  /**
   * Send a forbidden response (403)
   */
  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  /**
   * Send a bad request response (400)
   */
  static badRequest(res: Response, message: string = 'Bad request'): Response {
    return this.error(res, message, 400);
  }

  /**
   * Send a conflict response (409)
   */
  static conflict(res: Response, message: string = 'Conflict'): Response {
    return this.error(res, message, 409);
  }

  /**
   * Send an internal server error response (500)
   */
  static internalError(res: Response, message: string = 'Internal server error'): Response {
    return this.error(res, message, 500);
  }
}
