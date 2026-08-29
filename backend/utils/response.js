/**
 * Send a standardized success response.
 * @param {Object} res - Express response object
 * @param {string} message - User-friendly message
 * @param {Object|Array} data - Data to send back
 * @param {number} statusCode - HTTP status code (default 200)
 * @param {Object} pagination - Pagination info (default null)
 */
const sendSuccess = (res, message, data = {}, statusCode = 200, pagination = undefined) => {
  const response = {
    success: true,
    message,
    data,
  };
  
  if (pagination !== undefined) {
    response.pagination = pagination;
  } else {
    response.pagination = {};
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response.
 * @param {Object} res - Express response object
 * @param {string} message - User-friendly error message
 * @param {Array} errors - Detailed errors array (e.g. validator issues)
 * @param {number} statusCode - HTTP status code (default 500)
 */
const sendError = (res, message, errors = [], statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
