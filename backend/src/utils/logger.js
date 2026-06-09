/**
 * Logger Utility
 * Simple logging functions for consistent log formatting
 * Can be extended with Winston or similar libraries later
 */

/**
 * Log levels with colors for better visibility
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Get formatted timestamp
 * @returns {string} Formatted timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Log info message
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const info = (message, meta = {}) => {
  console.log(
    `${colors.cyan}[INFO]${colors.reset} [${getTimestamp()}] ${message}`,
    Object.keys(meta).length ? meta : ''
  );
};

/**
 * Log error message
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const error = (message, meta = {}) => {
  console.error(
    `${colors.red}[ERROR]${colors.reset} [${getTimestamp()}] ${message}`,
    Object.keys(meta).length ? meta : ''
  );
};

/**
 * Log warning message
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const warn = (message, meta = {}) => {
  console.warn(
    `${colors.yellow}[WARN]${colors.reset} [${getTimestamp()}] ${message}`,
    Object.keys(meta).length ? meta : ''
  );
};

/**
 * Log success message
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const success = (message, meta = {}) => {
  console.log(
    `${colors.green}[SUCCESS]${colors.reset} [${getTimestamp()}] ${message}`,
    Object.keys(meta).length ? meta : ''
  );
};

/**
 * Log debug message (only in development)
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const debug = (message, meta = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `${colors.blue}[DEBUG]${colors.reset} [${getTimestamp()}] ${message}`,
      Object.keys(meta).length ? meta : ''
    );
  }
};

export default {
  info,
  error,
  warn,
  success,
  debug
};
