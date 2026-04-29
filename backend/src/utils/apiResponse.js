const sendSuccess = (res, options, statusCode = 200) => {
  const responseBody = {
    success: true,
    ...options,
  };
  return res.status(statusCode).json(responseBody);
};

const sendError = (res, options, statusCode = 500) => {
  const responseBody = {
    success: false,
    ...options,
  };
  return res.status(statusCode).json(responseBody);
};

const sendValidationError = (res, message = 'Validation failed', errors = []) => {
  return sendError(res, { message, errors }, 400);
};

const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, { message }, 404);
};

const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, { message }, 401);
};

const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, { message }, 403);
};

const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, { message }, 400);
};

const sendConflict = (res, message = 'Conflict') => {
  return sendError(res, { message }, 409);
};

const sendInternalError = (res, message = 'Internal server error') => {
  return sendError(res, { message }, 500);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendBadRequest,
  sendConflict,
  sendInternalError,
};
