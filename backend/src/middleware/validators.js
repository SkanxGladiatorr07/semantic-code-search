/**
 * Request Validators
 * Middleware functions for validating request data
 */

/**
 * Validate repository creation data
 */
export const validateCreateRepository = (req, res, next) => {
  const { repository_name, github_url } = req.body;
  
  if (!repository_name || !github_url) {
    return res.status(400).json({
      success: false,
      message: 'Repository name and GitHub URL are required'
    });
  }

  const trimmedName = repository_name.trim();
  if (trimmedName.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Repository name must be at least 2 characters long'
    });
  }

  if (trimmedName.length > 255) {
    return res.status(400).json({
      success: false,
      message: 'Repository name too long (max 255 characters)'
    });
  }

  const trimmedUrl = github_url.trim();
  
  if (!trimmedUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub URL format. Must be: https://github.com/owner/repo'
    });
  }

  const cleanUrl = trimmedUrl.replace(/\.git$/, '').replace(/\/$/, '');

  req.body.repository_name = trimmedName;
  req.body.github_url = cleanUrl;
  req.body.description = req.body.description ? req.body.description.trim().substring(0, 500) : null;

  next();
};

/**
 * Validate repository update data
 */
export const validateUpdateRepository = (req, res, next) => {
  const { repository_name, github_url } = req.body;
  
  if (!repository_name && !github_url && req.body.description === undefined) {
    return res.status(400).json({
      success: false,
      message: 'At least one field must be provided'
    });
  }

  if (repository_name) {
    const trimmedName = repository_name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Repository name must be at least 2 characters long'
      });
    }
    if (trimmedName.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Repository name too long (max 255 characters)'
      });
    }
    req.body.repository_name = trimmedName;
  }

  if (github_url) {
    const trimmedUrl = github_url.trim();
    
    if (!trimmedUrl.match(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GitHub URL format. Must be: https://github.com/owner/repo'
      });
    }
    
    const cleanUrl = trimmedUrl.replace(/\.git$/, '').replace(/\/$/, '');
    req.body.github_url = cleanUrl;
  }

  if (req.body.description !== undefined) {
    req.body.description = req.body.description ? req.body.description.trim().substring(0, 500) : null;
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
