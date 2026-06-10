/**
 * Request Validators
 * Middleware functions for validating request data
 */

/**
 * Validate repository creation data
 */
export const validateCreateRepository = (req, res, next) => {
  const { repository_name, github_url } = req.body;
  
  // Check required fields
  if (!repository_name || !github_url) {
    return res.status(400).json({
      success: false,
      message: 'Repository name and GitHub URL are required'
    });
  }

  // Validate repository name
  const trimmedName = repository_name.trim();
  if (trimmedName.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Repository name must be at least 2 characters long'
    });
  }

  // Validate GitHub URL
  const trimmedUrl = github_url.trim();
  if (!trimmedUrl.startsWith('https://github.com/')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub URL format. Must start with https://github.com/'
    });
  }

  // Check URL format more specifically
  const urlParts = trimmedUrl.split('/');
  if (urlParts.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub URL. Must be in format: https://github.com/owner/repo'
    });
  }

  // Clean up the data for the next middleware/controller
  req.body.repository_name = trimmedName;
  req.body.github_url = trimmedUrl;
  req.body.description = req.body.description ? req.body.description.trim() : null;

  next();
};

/**
 * Validate repository update data
 */
export const validateUpdateRepository = (req, res, next) => {
  const { repository_name, github_url } = req.body;
  
  // Check if at least one field is provided
  if (!repository_name && !github_url && req.body.description === undefined) {
    return res.status(400).json({
      success: false,
      message: 'At least one field (repository_name, github_url, or description) must be provided'
    });
  }

  // Validate repository name if provided
  if (repository_name) {
    const trimmedName = repository_name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Repository name must be at least 2 characters long'
      });
    }
    req.body.repository_name = trimmedName;
  }

  // Validate GitHub URL if provided
  if (github_url) {
    const trimmedUrl = github_url.trim();
    if (!trimmedUrl.startsWith('https://github.com/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL format. Must start with https://github.com/'
      });
    }

    // Check URL format more specifically
    const urlParts = trimmedUrl.split('/');
    if (urlParts.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL. Must be in format: https://github.com/owner/repo'
      });
    }
    req.body.github_url = trimmedUrl;
  }

  // Clean up description if provided
  if (req.body.description !== undefined) {
    req.body.description = req.body.description ? req.body.description.trim() : null;
  }

  next();
};

/**
 * Validate repository ID parameter
 */
export const validateRepositoryId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid repository ID. Must be a positive integer.'
    });
  }

  // Convert to integer for consistency
  req.params.id = parseInt(id);
  next();
};

/**
 * Validate search query parameter
 */
export const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Search query must be at least 2 characters long'
    });
  }

  req.query.q = q.trim();
  next();
};

export default {
  validateCreateRepository,
  validateUpdateRepository,
  validateRepositoryId,
  validateSearchQuery
};
