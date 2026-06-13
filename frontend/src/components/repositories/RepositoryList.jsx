/**
 * Repository List Component
 * Displays a list of repositories with actions
 */

import { useState, useEffect } from 'react';
import { getRepositories, deleteRepository, searchRepositories } from '../../services/api';
import RepositoryForm from './RepositoryForm';
import ScanButton from './ScanButton';

const RepositoryList = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRepository, setEditingRepository] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch repositories on component mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  // Fetch all repositories
  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRepositories();
      setRepositories(response.data || []);
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to load repositories. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchRepositories();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await searchRepositories(searchQuery.trim());
      setRepositories(response.data || []);
    } catch (err) {
      console.error('Error searching repositories:', err);
      setError('Failed to search repositories.');
      fetchRepositories(); // Fallback to all repositories
    } finally {
      setLoading(false);
    }
  };

  // Handle repository delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this repository?')) {
      return;
    }

    try {
      await deleteRepository(id);
      
      // Update local state
      setRepositories(prev => prev.filter(repo => repo.id !== id));
      
      // Reset delete confirmation
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error deleting repository:', err);
      setError('Failed to delete repository.');
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRepository(null);
    fetchRepositories(); // Refresh list
  };

  // Handle edit repository
  const handleEdit = (repository) => {
    setEditingRepository(repository);
    setShowForm(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract owner and repo from GitHub URL
  const getRepoOwnerAndName = (url) => {
    if (!url.startsWith('https://github.com/')) return { owner: '', name: url };
    
    const parts = url.split('/');
    if (parts.length >= 5) {
      return {
        owner: parts[3],
        name: parts[4]
      };
    }
    return { owner: '', name: url };
  };

  // Handle Enter key in search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    fetchRepositories();
  };

  return (
    <div className="repository-list-container">
      {/* Header */}
      <div className="repository-header">
        <h2>My Repositories</h2>
        <p className="repository-subtitle">
          Manage your imported GitHub repositories
        </p>
      </div>

      {/* Controls */}
      <div className="repository-controls">
        <div className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search repositories..."
              className="search-input"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              className="btn btn-primary"
              disabled={loading || !searchQuery.trim()}
            >
              🔍 Search
            </button>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="btn btn-secondary"
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary add-repo-btn"
          disabled={loading || showForm}
        >
          + Add Repository
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={fetchRepositories} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Repository Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => {
                setShowForm(false);
                setEditingRepository(null);
              }}
            >
              ×
            </button>
            <RepositoryForm
              repository={editingRepository}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingRepository(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading repositories...</p>
        </div>
      )}

      {/* Repository List */}
      {!loading && !error && (
        <div className="repository-list">
          {repositories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No repositories found</h3>
              <p>
                {searchQuery
                  ? 'No repositories match your search. Try a different query.'
                  : 'Add your first repository to get started.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Add Repository
                </button>
              )}
            </div>
          ) : (
            <div className="repository-grid">
              {repositories.map((repo) => {
                const { owner, name } = getRepoOwnerAndName(repo.github_url);
                
                return (
                  <div key={repo.id} className="repository-card">
                    <div className="card-header">
                      <h3 className="card-title">{repo.repository_name}</h3>
                      <span className="card-date">
                        Added: {formatDate(repo.created_at)}
                      </span>
                    </div>
                    
                    <div className="card-body">
                      <div className="github-info">
                        <span className="github-icon">🐙</span>
                        <a
                          href={repo.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-link"
                        >
                          {owner}/{name}
                        </a>
                      </div>
                      
                      {repo.description && (
                        <p className="card-description">{repo.description}</p>
                      )}
                      
                      <div className="card-meta">
                        <span className="meta-item">
                          ID: <strong>#{repo.id}</strong>
                        </span>
                        <span className="meta-item">
                          Updated: {formatDate(repo.updated_at)}
                        </span>
                        {repo.scan_status === 'completed' && (
                          <span className="meta-item">
                            <Link 
                              to={`/repositories/${repo.id}/files`}
                              className="view-files-link"
                            >
                              📁 View Files ({repo.total_files})
                            </Link>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      <ScanButton 
                        repository={repo} 
                        onScanComplete={fetchRepositories}
                      />
                      <button
                        onClick={() => handleEdit(repo)}
                        className="btn btn-secondary btn-sm"
                        disabled={loading}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(repo.id)}
                        className="btn btn-danger btn-sm"
                        disabled={loading || deleteConfirmId === repo.id}
                      >
                        {deleteConfirmId === repo.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Stats Footer */}
      {!loading && repositories.length > 0 && (
        <div className="repository-stats">
          <p>
            Showing <strong>{repositories.length}</strong> repository
            {repositories.length !== 1 ? 'ies' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}

      <style jsx>{`
        .repository-list-container {
          padding: var(--spacing-lg);
        }
        
        .repository-header {
          margin-bottom: var(--spacing-xl);
        }
        
        .repository-header h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
        }
        
        .repository-subtitle {
          color: var(--text-secondary);
        }
        
        .repository-controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
          align-items: center;
        }
        
        .search-container {
          flex: 1;
          min-width: 300px;
        }
        
        .search-input-group {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .search-input {
          flex: 1;
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .add-repo-btn {
          white-space: nowrap;
        }
        
        .error-message {
          background: #fee2e2;
          color: var(--error-color);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
        }
        
        .modal-content {
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          padding: var(--spacing-xs);
        }
        
        .modal-close:hover {
          color: var(--text-primary);
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }
        
        .loading-state .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-lg);
        }
        
        .repository-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .repository-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          transition: all var(--transition-medium);
          display: flex;
          flex-direction: column;
        }
        
        .repository-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
        }
        
        .card-title {
          font-size: 1.25rem;
          margin: 0;
          color: var(--text-primary);
        }
        
        .card-date {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .card-body {
          flex: 1;
          margin-bottom: var(--spacing-lg);
        }
        
        .github-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }
        
        .github-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
        }
        
        .github-link:hover {
          text-decoration: underline;
        }
        
        .card-description {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
          line-height: 1.5;
        }
        
        .card-meta {
          display: flex;
          gap: var(--spacing-lg);
          font-size: 0.875rem;
          color: var(--text-light);
          flex-wrap: wrap;
        }
        
        .view-files-link {
          color: var(--primary-color);
          font-weight: 600;
          text-decoration: none;
        }
        
        .view-files-link:hover {
          text-decoration: underline;
        }
        
        .card-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .btn-sm {
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: 0.875rem;
        }
        
        .btn-danger {
          background: #fee2e2;
          color: var(--error-color);
          border: 1px solid #fecaca;
        }
        
        .btn-danger:hover:not(:disabled) {
          background: #fecaca;
        }
        
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }
        
        .empty-state h3 {
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }
        
        .repository-stats {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-color);
          color: var(--text-secondary);
          text-align: center;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .repository-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-input-group {
            flex-direction: column;
          }
          
          .repository-grid {
            grid-template-columns: 1fr;
          }
          
          .card-header {
            flex-direction: column;
            gap: var(--spacing-xs);
          }
          
          .card-meta {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  );
};

export default RepositoryList;