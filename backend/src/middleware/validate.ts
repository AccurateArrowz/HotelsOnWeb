import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Express middleware for validating request data against Zod schemas
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
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: result.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // Attach validated data to request for use in controllers
      (req as any).validatedData = result.data;
      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Validation error',
      });
    }
  };
};
