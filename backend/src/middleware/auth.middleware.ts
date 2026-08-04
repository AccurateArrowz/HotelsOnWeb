import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../common/types';
import { ApiResponseHandler } from '../common/api-response';

/**
 * Verify JWT token and attach user to request
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return ApiResponseHandler.unauthorized(res, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      roleId: decoded.roleId,
    };
    req.userId = decoded.id;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return ApiResponseHandler.unauthorized(res, 'Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return ApiResponseHandler.unauthorized(res, 'Invalid token');
    }
    return ApiResponseHandler.unauthorized(res);
  }
};

/**
 * Optional authentication - doesn't fail if token is missing
 */
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        roleId: decoded.roleId,
      };
      req.userId = decoded.id;
    }
  } catch (error) {
    // Silently fail - user is optional
  }

  next();
};

/**
 * Require specific role
 */
export const requireRole = (roleId: number) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponseHandler.unauthorized(res);
    }

    if (req.user.roleId !== roleId) {
      return ApiResponseHandler.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};
