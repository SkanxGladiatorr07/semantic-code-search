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

// ============================================
// Repository API Functions
// ============================================

/**
 * Get all repositories
 * @returns {Promise<Array>} Array of repository objects
 */
export const getRepositories = async () => {
  try {
    const response = await apiClient.get('/repositories');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch repositories');
  }
};

/**
 * Get single repository by ID
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Repository object
 */
export const getRepositoryById = async (id) => {
  try {
    const response = await apiClient.get(`/repositories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch repository');
  }
};

/**
 * Create a new repository
 * @param {Object} repositoryData - Repository data
 * @param {string} repositoryData.repository_name - Repository name
 * @param {string} repositoryData.github_url - GitHub URL
 * @param {string} repositoryData.description - Repository description
 * @returns {Promise<Object>} Created repository object
 */
export const createRepository = async (repositoryData) => {
  try {
    const response = await apiClient.post('/repositories', repositoryData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to create repository');
    }
    throw new Error('Failed to create repository');
  }
};

/**
 * Update a repository
 * @param {number} id - Repository ID
 * @param {Object} repositoryData - Updated repository data
 * @returns {Promise<Object>} Updated repository object
 */
export const updateRepository = async (id, repositoryData) => {
  try {
    const response = await apiClient.put(`/repositories/${id}`, repositoryData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to update repository');
    }
    throw new Error('Failed to update repository');
  }
};

/**
 * Delete a repository
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Success message
 */
export const deleteRepository = async (id) => {
  try {
    const response = await apiClient.delete(`/repositories/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to delete repository');
    }
    throw new Error('Failed to delete repository');
  }
};

/**
 * Search repositories
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching repositories
 */
export const searchRepositories = async (query) => {
  try {
    const response = await apiClient.get(`/repositories/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to search repositories');
  }
};

/**
 * Scan repository
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Scan result
 */
export const scanRepository = async (id) => {
  try {
    const response = await apiClient.post(`/repositories/${id}/scan`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to scan repository');
    }
    throw new Error('Failed to scan repository');
  }
};

/**
 * Get repository files
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Repository files data
 */
export const getRepositoryFiles = async (id) => {
  try {
    const response = await apiClient.get(`/repositories/${id}/files`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch repository files');
    }
    throw new Error('Failed to fetch repository files');
  }
};

/**
 * Analyze repository
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Analysis result
 */
export const analyzeRepository = async (id) => {
  try {
    const response = await apiClient.post(`/repositories/${id}/analyze`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to analyze repository');
    }
    throw new Error('Failed to analyze repository');
  }
};

/**
 * Get repository symbols
 * @param {number} id - Repository ID
 * @param {Object} params - Query parameters (type, search)
 * @returns {Promise<Object>} Repository symbols data
 */
export const getRepositorySymbols = async (id, params = {}) => {
  try {
    const response = await apiClient.get(`/repositories/${id}/symbols`, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch symbols');
    }
    throw new Error('Failed to fetch symbols');
  }
};

/**
 * Search repository symbols
 * @param {number} id - Repository ID
 * @param {string} query - Search query
 * @param {string} type - Optional symbol type filter
 * @returns {Promise<Object>} Search results
 */
export const searchRepositorySymbols = async (id, query, type = null) => {
  try {
    const params = { query };
    if (type) params.type = type;
    const response = await apiClient.get(`/repositories/${id}/search`, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to search symbols');
    }
    throw new Error('Failed to search symbols');
  }
};

export default apiClient;
