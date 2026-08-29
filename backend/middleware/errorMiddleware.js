const { sendError } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Log error in non-test environments
  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${message}`);
    if (err.stack && process.env.NODE_ENV === "development") {
      console.error(err.stack);
    }
  }

  // Handle Mongoose / MongoDB specific errors cleanly
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((el) => el.message);
  } else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate field value entered: ${field}. Please use another value!`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field ${err.path}: ${err.value}`;
  }

  return sendError(res, message, errors, statusCode);
};

module.exports = errorHandler;
