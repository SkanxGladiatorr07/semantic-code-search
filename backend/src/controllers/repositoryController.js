/**
 * Repository Controller
 * Handles HTTP requests for repository operations
 */

import RepositoryModel from '../models/RepositoryModel.js';

/**
 * Get all repositories
 * @route GET /api/repositories
 * @access Public
 */
export const getRepositories = async (req, res) => {
  try {
    const repositories = await RepositoryModel.findAll();
    
    res.status(200).json({
      success: true,
      count: repositories.length,
      data: repositories
    });
  } catch (error) {
    console.error('Error in getRepositories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repositories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get single repository by ID
 * @route GET /api/repositories/:id
 * @access Public
 */
export const getRepositoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID'
      });
    }

    const repository = await RepositoryModel.findById(parseInt(id));
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      data: repository
    });
  } catch (error) {
    console.error(`Error in getRepositoryById for ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repository',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new repository
 * @route POST /api/repositories
 * @access Public
 */
export const createRepository = async (req, res) => {
  try {
    const { repository_name, github_url, description } = req.body;
    
    // Validate required fields
    if (!repository_name || !github_url) {
      return res.status(400).json({
        success: false,
        message: 'Repository name and GitHub URL are required'
      });
    }

    // Trim and validate input
    const trimmedName = repository_name.trim();
    const trimmedUrl = github_url.trim();
    
    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Repository name must be at least 2 characters long'
      });
    }

    if (!trimmedUrl.startsWith('https://github.com/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL format. Must start with https://github.com/'
      });
    }

    const repositoryData = {
      repository_name: trimmedName,
      github_url: trimmedUrl,
      description: description ? description.trim() : null
    };

    const repository = await RepositoryModel.create(repositoryData);
    
    res.status(201).json({
      success: true,
      message: 'Repository created successfully',
      data: repository
    });
  } catch (error) {
    console.error('Error in createRepository:', error);
    
    if (error.message === 'Repository with this GitHub URL already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create repository',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a repository
 * @route PUT /api/repositories/:id
 * @access Public
 */
export const updateRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const { repository_name, github_url, description } = req.body;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID'
      });
    }

    // Validate at least one field is provided
    if (!repository_name && !github_url && description === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (repository_name, github_url, or description) must be provided'
      });
    }

    // Validate GitHub URL format if provided
    if (github_url && !github_url.trim().startsWith('https://github.com/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL format. Must start with https://github.com/'
      });
    }

    const updateData = {};
    if (repository_name) updateData.repository_name = repository_name.trim();
    if (github_url) updateData.github_url = github_url.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;

    const repository = await RepositoryModel.update(parseInt(id), updateData);
    
    if (!repository) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Repository updated successfully',
      data: repository
    });
  } catch (error) {
    console.error(`Error in updateRepository for ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update repository',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a repository
 * @route DELETE /api/repositories/:id
 * @access Public
 */
export const deleteRepository = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid repository ID'
      });
    }

    const deleted = await RepositoryModel.delete(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Repository deleted successfully'
    });
  } catch (error) {
    console.error(`Error in deleteRepository for ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete repository',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search repositories
 * @route GET /api/repositories/search?q=:query
 * @access Public
 */
export const searchRepositories = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const repositories = await RepositoryModel.search(q.trim());
    
    res.status(200).json({
      success: true,
      count: repositories.length,
      query: q,
      data: repositories
    });
  } catch (error) {
    console.error(`Error in searchRepositories with query "${req.query.q}":`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to search repositories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  getRepositories,
  getRepositoryById,
  createRepository,
  updateRepository,
  deleteRepository,
  searchRepositories
};
