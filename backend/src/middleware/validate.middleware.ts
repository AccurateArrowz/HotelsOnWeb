import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiResponseHandler } from '../common/api-response';

type RequestSchemas = {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
};

export const validate =
  (schemas: RequestSchemas) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const issues: { field: string; message: string }[] = [];

    for (const source of ['body', 'query', 'params'] as const) {
      const schema = schemas[source];
      if (!schema) continue;

      const result = schema.safeParse(req[source]);
      if (result.success) {
        // Only body is safely writable in Express 5
        if (source === 'body') req.body = result.data;
      } else {
        issues.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.length > 0 ? `${source}.${issue.path.join('.')}` : source,
            message: issue.message,
          }))
        );
      }
    }

    if (issues.length > 0) {
      ApiResponseHandler.validationError(res, 'Validation failed', issues);
      return;
    }

    next();
  };
