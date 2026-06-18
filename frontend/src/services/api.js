/**
 * API Service
 * Centralized API configuration and request handlers using Axios
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const REQUEST_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);
      
      const status = error.response.status;
      const userMessage = error.response.data?.userMessage;
      const message = error.response.data?.message || 'An error occurred';
      
      if (userMessage) {
        error.userMessage = userMessage;
      } else if (status === 404) {
        error.userMessage = 'Resource not found';
      } else if (status === 400) {
        error.userMessage = message || 'Invalid request';
      } else if (status === 500) {
        error.userMessage = 'Server error. Please try again later.';
      } else if (status === 503) {
        error.userMessage = 'Service unavailable. Please try again later.';
      } else {
        error.userMessage = message;
      }
    } else if (error.request) {
      console.error('Network error: No response received');
      error.userMessage = 'Network error. Please check your connection.';
    } else {
      console.error('Request setup error:', error.message);
      error.userMessage = 'Failed to send request. Please try again.';
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
    return response.data || { success: true, data: [] };
  } catch (error) {
    throw new Error(error.userMessage || 'Failed to fetch repositories');
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
    return response.data || { success: true, data: null };
  } catch (error) {
    throw new Error(error.userMessage || 'Failed to fetch repository');
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
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to create repository');
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
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to update repository');
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
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to delete repository');
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
    return response.data || { success: true, data: [] };
  } catch (error) {
    throw new Error(error.userMessage || 'Failed to search repositories');
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
    return response.data || { success: true, data: {} };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to scan repository');
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
    return response.data || { success: true, data: { files: [] } };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to fetch repository files');
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
    return response.data || { success: true, data: {} };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to analyze repository');
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
    return response.data || { success: true, data: { symbols: [], statistics: {}, grouped: {} } };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to fetch symbols');
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
    return response.data || { success: true, data: { symbols: [], statistics: {} } };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to search symbols');
  }
};

/**
 * Chat with repository
 * @param {number} id - Repository ID
 * @param {string} question - User question
 * @returns {Promise<Object>} AI response
 */
export const chatWithRepository = async (id, question) => {
  try {
    const response = await apiClient.post(`/repositories/${id}/chat`, { question });
    return response.data || { success: true, data: { answer: '', context_size: {} } };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to get response');
  }
};

/**
 * Get repository insights
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Repository insights
 */
export const getRepositoryInsights = async (id) => {
  try {
    const response = await apiClient.get(`/repositories/${id}/insights`);
    return response.data || { success: true, data: { repository: {}, statistics: {}, file_types: [] } };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to fetch insights');
  }
};

/**
 * Generate repository summary
 * @param {number} id - Repository ID
 * @returns {Promise<Object>} Generated summary
 */
export const generateRepositorySummary = async (id) => {
  try {
    const response = await apiClient.post(`/repositories/${id}/summary`);
    return response.data || { success: true, data: { summary: {}, statistics: {} } };
  } catch (error) {
    throw new Error(error.userMessage || error.response?.data?.message || 'Failed to generate summary');
  }
};

export default apiClient;
