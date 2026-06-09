/**
 * Health Check Controller
 * Handles health check endpoints for monitoring server status
 */

/**
 * Get server health status
 * @route GET /api/health
 * @access Public
 */
export const getHealthStatus = (req, res) => {
  const healthData = {
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'semantic-code-search-api'
  };

  res.status(200).json(healthData);
};

/**
 * Get detailed system information
 * @route GET /api/health/detailed
 * @access Public
 */
export const getDetailedHealth = (req, res) => {
  const detailedHealth = {
    success: true,
    timestamp: new Date().toISOString(),
    system: {
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
      },
      cpu: process.cpuUsage()
    },
    environment: process.env.NODE_ENV || 'development',
    service: {
      name: 'semantic-code-search-api',
      version: '1.0.0',
      status: 'operational'
    }
  };

  res.status(200).json(detailedHealth);
};

export default {
  getHealthStatus,
  getDetailedHealth
};
