/**
 * Custom HTTP error class for consistent error handling
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  /**
   * Common HTTP error factory methods
   */
  static badRequest(message: string, details?: any): HttpError {
    return new HttpError(400, message, details);
  }

  static unauthorized(message: string = 'Unauthorized'): HttpError {
    return new HttpError(401, message);
  }

  static forbidden(message: string = 'Forbidden'): HttpError {
    return new HttpError(403, message);
  }

  static notFound(message: string = 'Not found'): HttpError {
    return new HttpError(404, message);
  }

  static conflict(message: string, details?: any): HttpError {
    return new HttpError(409, message, details);
  }

  static unprocessableEntity(message: string, details?: any): HttpError {
    return new HttpError(422, message, details);
  }

  static internalServerError(message: string = 'Internal server error'): HttpError {
    return new HttpError(500, message);
  }

  /**
   * Convert to response object
   */
  toResponse() {
    return {
      status: 'error',
      statusCode: this.statusCode,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}
