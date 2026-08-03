/**
 * @typedef {Object} SuccessResponseOptions
 * @property {string} [message] - Optional success message
 * @property {any} [data] - Response data
 * @property {Record<string, any>} [meta] - Optional metadata
 */

/**
 * @typedef {Object} ErrorResponseOptions
 * @property {string} message - Error message
 * @property {Array<{field: string, message: string}>} [errors] - Optional error details
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {SuccessResponseOptions} options - Response options
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {Object} Response object
 */
const sendSuccess = (res, options, statusCode = 200) => {
  const responseBody = {
    success: true,
    ...options,
  };
  return res.status(statusCode).json(responseBody);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {ErrorResponseOptions} options - Response options
 * @param {number} [statusCode=500] - HTTP status code
 * @returns {Object} Response object
 */
const sendError = (res, options, statusCode = 500) => {
  const responseBody = {
    success: false,
    ...options,
  };
  return res.status(statusCode).json(responseBody);
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {string} [message='Validation failed'] - Error message
 * @param {Array<{field: string, message: string}>} [errors=[]] - Validation error details
 * @returns {Object} Response object
 */
const sendValidationError = (res, message = 'Validation failed', errors = []) => {
  return sendError(res, { message, errors }, 400);
};

/**
 * Send a 404 Not Found response
 * @param {Object} res - Express response object
 * @param {string} [message='Resource not found'] - Error message
 * @returns {Object} Response object
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, { message }, 404);
};

/**
 * Send a 401 Unauthorized response
 * @param {Object} res - Express response object
 * @param {string} [message='Unauthorized'] - Error message
 * @returns {Object} Response object
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, { message }, 401);
};

/**
 * Send a 403 Forbidden response
 * @param {Object} res - Express response object
 * @param {string} [message='Forbidden'] - Error message
 * @returns {Object} Response object
 */
const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, { message }, 403);
};

/**
 * Send a 400 Bad Request response
 * @param {Object} res - Express response object
 * @param {string} [message='Bad request'] - Error message
 * @returns {Object} Response object
 */
const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, { message }, 400);
};

/**
 * Send a 409 Conflict response
 * @param {Object} res - Express response object
 * @param {string} [message='Conflict'] - Error message
 * @returns {Object} Response object
 */
const sendConflict = (res, message = 'Conflict') => {
  return sendError(res, { message }, 409);
};

/**
 * Send a 500 Internal Server Error response
 * @param {Object} res - Express response object
 * @param {string} [message='Internal Server Error'] - Error message
 * @returns {Object} Response object
 */
const sendInternalError = (res, message = 'Internal Server Error') => {
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
