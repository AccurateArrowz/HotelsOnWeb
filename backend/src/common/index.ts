/**
 * Common layer exports
 * Includes base repository, error handling, API responses, and middleware
 */

// Repository
export { BaseRepository } from './base.repository';

// Error handling
export { HttpError } from './http-error';

// API Response
export { ApiResponseHandler } from './api-response';

// Types
export type { AuthenticatedRequest, PaginationOptions, PaginationMeta, QueryOptions } from './types';

// Middleware
export { authenticateToken, optionalAuth, requireRole } from '../middleware/auth.middleware';
export { errorMiddleware, asyncHandler } from '../middleware/error.middleware';
export {
  validateRequest,
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.middleware';
