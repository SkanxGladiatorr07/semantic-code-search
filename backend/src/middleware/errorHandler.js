/**
 * Error Handling Middleware
 * Centralized error handling for the Express application
 */

/**
 * Global error handler middleware
 * Catches all errors thrown in the application
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  const statusCode = err.statusCode || 500;

  const userFriendlyMessages = {
    400: 'Invalid request. Please check your input.',
    404: 'Resource not found.',
    500: 'An unexpected error occurred. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.'
  };

  const userMessage = userFriendlyMessages[statusCode] || err.message || 'An error occurred';

  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    userMessage: userMessage,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default errorHandler;
