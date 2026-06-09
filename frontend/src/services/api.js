/**
 * API Service
 * Centralized API configuration and request handlers using Axios
 */

import axios from 'axios';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Create and configure Axios instance
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor
 * Add authentication tokens or modify requests before sending
 */
apiClient.interceptors.request.use(
  (config) => {
    // Future: Add authentication token here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle responses and errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response received');
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================
// API Functions
// ============================================

/**
 * Check server health status
 * @returns {Promise<Object>} Health status data
 */
export const getHealthStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch health status');
  }
};

/**
 * Check if server is running
 * @returns {Promise<boolean>} True if server is healthy
 */
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data.success === true;
  } catch (error) {
    return false;
  }
};

/**
 * Get detailed health information
 * @returns {Promise<Object>} Detailed health data
 */
export const getDetailedHealth = async () => {
  try {
    const response = await apiClient.get('/health/detailed');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch detailed health status');
  }
};

// Future API functions will be added here:
// export const getRepositories = async () => { ... }
// export const importRepository = async (repoUrl) => { ... }
// export const searchCode = async (query) => { ... }

export default apiClient;
