const { z } = require('zod');
const { sendValidationError } = require('../utils/apiResponse');

const validate = (schema) => {
  return async (req, res, next) => {
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

module.exports = { validate };
