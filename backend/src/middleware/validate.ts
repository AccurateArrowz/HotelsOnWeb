import { Request, Response, NextFunction } from 'express';
import { z, ZodObject, ZodRawShape } from 'zod';
import { sendValidationError } from '../utils/apiResponse';

export const validate = (schema: ZodObject<ZodRawShape>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorDetails = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return sendValidationError(res, 'Validation failed', errorDetails);
      }
      return next(error);
    }
  };
};
