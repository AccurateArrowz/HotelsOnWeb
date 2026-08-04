import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponseHandler } from '../common/api-response';

/**
 * Validate request data against Zod schema
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return ApiResponseHandler.validationError(res, 'Validation failed', errors);
      }

      // Attach validated data to request for use in controllers
      (req as any).validatedData = result.data;
      next();
    } catch (error) {
      return ApiResponseHandler.internalError(res, 'Validation error');
    }
  };
};

/**
 * Validate request body only
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return ApiResponseHandler.validationError(res, 'Validation failed', errors);
      }

      (req as any).validatedData = result.data;
      next();
    } catch (error) {
      return ApiResponseHandler.internalError(res, 'Validation error');
    }
  };
};

/**
 * Validate request params only
 */
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return ApiResponseHandler.validationError(res, 'Validation failed', errors);
      }

      (req as any).validatedData = result.data;
      next();
    } catch (error) {
      return ApiResponseHandler.internalError(res, 'Validation error');
    }
  };
};

/**
 * Validate request query only
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return ApiResponseHandler.validationError(res, 'Validation failed', errors);
      }

      (req as any).validatedData = result.data;
      next();
    } catch (error) {
      return ApiResponseHandler.internalError(res, 'Validation error');
    }
  };
};
