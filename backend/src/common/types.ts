import { Request } from 'express';
import User from '../models/User';

/**
 * Extended Express Request with authenticated user context
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roleId: number | null;
  };
  userId?: number;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Query options for repository methods
 */
export interface QueryOptions {
  where?: any;
  include?: any;
  order?: any;
  limit?: number;
  offset?: number;
  pagination?: PaginationOptions;
}
