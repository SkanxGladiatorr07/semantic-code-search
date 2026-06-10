/**
 * Repository Form Component
 * Form for creating and editing repositories
 */

import { useState } from 'react';
import { createRepository, updateRepository } from '../../services/api';

const RepositoryForm = ({ repository = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    repository_name: repository?.repository_name || '',
    github_url: repository?.github_url || '',
    description: repository?.description || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Validate repository name
    if (!formData.repository_name.trim()) {
      newErrors.repository_name = 'Repository name is required';
    } else if (formData.repository_name.trim().length < 2) {
      newErrors.repository_name = 'Repository name must be at least 2 characters long';
    }
    
    // Validate GitHub URL
    if (!formData.github_url.trim()) {
      newErrors.github_url = 'GitHub URL is required';
    } else if (!formData.github_url.trim().startsWith('https://github.com/')) {
      newErrors.github_url = 'Must be a valid GitHub URL (https://github.com/owner/repo)';
    } else if (formData.github_url.trim().split('/').length < 5) {
      newErrors.github_url = 'Invalid GitHub URL format. Must be: https://github.com/owner/repo';
    }
    
    // Validate description length
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      let result;
      const repositoryData = {
        repository_name: formData.repository_name.trim(),
        github_url: formData.github_url.trim(),
        description: formData.description.trim() || null
      };
      
      if (repository) {
        // Update existing repository
        result = await updateRepository(repository.id, repositoryData);
        setSuccessMessage('Repository updated successfully!');
      } else {
        // Create new repository
        result = await createRepository(repositoryData);
        setSuccessMessage('Repository created successfully!');
        
        // Clear form for new entry
        setFormData({
          repository_name: '',
          github_url: '',
          description: ''
        });
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.data);
      }
      
    } catch (error) {
      console.error('Error saving repository:', error);
      
      // Handle specific error messages
      if (error.message.includes('already exists')) {
        setErrors({ github_url: error.message });
      } else if (error.message.includes('Invalid GitHub URL')) {
        setErrors({ github_url: error.message });
      } else {
        setErrors({ form: error.message || 'Failed to save repository. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Format GitHub URL for display
  const formatGitHubUrl = (url) => {
    if (!url.startsWith('https://github.com/')) return url;
    const parts = url.split('/');
    return parts.slice(3).join('/');
  };

  return (
    <div className="repository-form-container">
      <form onSubmit={handleSubmit} className="repository-form">
        <h2 className="form-title">
          {repository ? 'Edit Repository' : 'Add New Repository'}
        </h2>
        
        {/* Form-level error */}
        {errors.form && (
          <div className="error-message form-error">
            <p>❌ {errors.form}</p>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="success-message">
            <p>✅ {successMessage}</p>
          </div>
        )}
        
        {/* Repository Name Field */}
        <div className="form-group">
          <label htmlFor="repository_name" className="form-label">
            Repository Name *
          </label>
          <input
            type="text"
            id="repository_name"
            name="repository_name"
            value={formData.repository_name}
            onChange={handleChange}
            className={`form-input ${errors.repository_name ? 'error' : ''}`}
            placeholder="e.g., react, node.js, express"
            disabled={loading}
          />
          {errors.repository_name && (
            <span className="error-text">{errors.repository_name}</span>
          )}
        </div>
        
        {/* GitHub URL Field */}
        <div className="form-group">
          <label htmlFor="github_url" className="form-label">
            GitHub URL *
          </label>
          <input
            type="url"
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            className={`form-input ${errors.github_url ? 'error' : ''}`}
            placeholder="https://github.com/owner/repository"
            disabled={loading}
          />
          {errors.github_url && (
            <span className="error-text">{errors.github_url}</span>
          )}
          {formData.github_url && !errors.github_url && (
            <div className="url-preview">
              <small>
                Preview: {formatGitHubUrl(formData.github_url)}
              </small>
            </div>
          )}
        </div>
        
        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Brief description of the repository (optional)"
            rows="4"
            disabled={loading}
            maxLength="500"
          />
          <div className="textarea-info">
            <span className="char-count">
              {formData.description.length}/500 characters
            </span>
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {repository ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              repository ? 'Update Repository' : 'Add Repository'
            )}
          </button>
        </div>
        
        {/* Form Help Text */}
        <div className="form-help">
          <p className="help-text">
            <strong>* Required fields</strong>
          </p>
          <p className="help-text">
            Make sure the GitHub URL is public and accessible.
          </p>
        </div>
      </form>
      
      <style jsx>{`
        .repository-form-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .repository-form {
          background: var(--bg-primary);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }
        
        .form-title {
          margin-bottom: var(--spacing-lg);
          color: var(--text-primary);
          font-size: 1.5rem;
        }
        
        .form-group {
          margin-bottom: var(--spacing-lg);
        }
        
        .form-label {
          display: block;
          margin-bottom: var(--spacing-sm);
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .form-input,
        .form-textarea {
          width: 100%;
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: all var(--transition-fast);
        }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-input.error,
        .form-textarea.error {
          border-color: var(--error-color);
        }
        
        .error-text {
          display: block;
          margin-top: var(--spacing-xs);
          color: var(--error-color);
          font-size: 0.875rem;
        }
        
        .textarea-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-xs);
        }
        
        .char-count {
          color: var(--text-light);
          font-size: 0.875rem;
        }
        
        .url-preview {
          margin-top: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-xl);
        }
        
        .btn {
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
        }
        
        .btn-primary {
          background: var(--primary-color);
          color: white;
          border: none;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }
        
        .btn-secondary {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: var(--bg-tertiary);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        .error-message,
        .success-message {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .error-message {
          background: #fee2e2;
          color: var(--error-color);
          border: 1px solid #fecaca;
        }
        
        .success-message {
          background: #d1fae5;
          color: var(--success-color);
          border: 1px solid #a7f3d0;
        }
        
        .form-help {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }
        
        .help-text {
          margin-bottom: var(--spacing-xs);
          color: var(--text-secondary);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RepositoryForm;