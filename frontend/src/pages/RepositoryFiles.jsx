/**
 * Repository Files Page
 * Displays scanned files from a repository
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositoryFiles } from '../services/api';

const RepositoryFiles = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterExtension, setFilterExtension] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFiles();
  }, [id]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRepositoryFiles(id);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to load repository files');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFiles = () => {
    if (!data || !data.files) return [];

    let filtered = data.files;

    if (filterExtension) {
      filtered = filtered.filter(file => file.file_extension === filterExtension);
    }

    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.file_path.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getUniqueExtensions = () => {
    if (!data || !data.files) return [];
    
    const extensions = new Set();
    data.files.forEach(file => {
      if (file.file_extension) {
        extensions.add(file.file_extension);
      }
    });
    
    return Array.from(extensions).sort();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (extension) => {
    const iconMap = {
      '.js': '📜',
      '.jsx': '⚛️',
      '.ts': '📘',
      '.tsx': '⚛️',
      '.py': '🐍',
      '.java': '☕',
      '.cpp': '⚙️',
      '.c': '⚙️',
      '.html': '🌐',
      '.css': '🎨',
      '.json': '📋',
      '.md': '📝',
      '.txt': '📄',
      '.xml': '📰',
      '.yml': '⚙️',
      '.yaml': '⚙️',
      '.sql': '🗃️',
      '.sh': '🐚',
      '.env': '🔐',
      '.png': '🖼️',
      '.jpg': '🖼️',
      '.svg': '🎨',
      '.pdf': '📕',
      '.zip': '🗜️'
    };

    return iconMap[extension] || '📄';
  };

  const filteredFiles = getFilteredFiles();
  const extensions = getUniqueExtensions();

  if (loading) {
    return (
      <div className="files-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading repository files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="files-page">
        <div className="error-container">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <Link to="/repositories" className="btn btn-primary">
            Back to Repositories
          </Link>
        </div>
      </div>
    );
  }

  if (!data || !data.repository) {
    return (
      <div className="files-page">
        <div className="error-container">
          <h2>Repository not found</h2>
          <Link to="/repositories" className="btn btn-primary">
            Back to Repositories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="files-page">
      <div className="page-header">
        <div className="header-content">
          <Link to="/repositories" className="back-link">
            ← Back to Repositories
          </Link>
          <h1>{data.repository.repository_name}</h1>
          <p className="repo-url">
            <a href={data.repository.github_url} target="_blank" rel="noopener noreferrer">
              {data.repository.github_url}
            </a>
          </p>
        </div>
      </div>

      <div className="page-content">
        {data.repository.scan_status !== 'completed' ? (
          <div className="not-scanned">
            <h2>Repository not scanned yet</h2>
            <p>Please scan the repository first to view its files.</p>
            <Link to="/repositories" className="btn btn-primary">
              Go to Repositories
            </Link>
          </div>
        ) : (
          <>
            <div className="files-header">
              <div className="files-stats">
                <div className="stat-card">
                  <span className="stat-label">Total Files</span>
                  <span className="stat-value">{data.total_files}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">File Types</span>
                  <span className="stat-value">{extensions.length}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Scanned</span>
                  <span className="stat-value">
                    {new Date(data.repository.scanned_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="files-controls">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                
                <select
                  value={filterExtension}
                  onChange={(e) => setFilterExtension(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All file types</option>
                  {extensions.map(ext => (
                    <option key={ext} value={ext}>{ext}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="files-list">
              {filteredFiles.length === 0 ? (
                <div className="no-files">
                  <p>No files found matching your filters</p>
                </div>
              ) : (
                <table className="files-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>File Name</th>
                      <th>Path</th>
                      <th>Extension</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr key={file.id}>
                        <td className="file-icon">{getFileIcon(file.file_extension)}</td>
                        <td className="file-name">{file.file_name}</td>
                        <td className="file-path">{file.file_path}</td>
                        <td className="file-extension">
                          {file.file_extension || '-'}
                        </td>
                        <td className="file-size">{formatFileSize(file.file_size)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="files-footer">
              <p>Showing {filteredFiles.length} of {data.total_files} files</p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .files-page {
          min-height: 100vh;
          background: var(--bg-secondary);
        }

        .page-header {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          padding: var(--spacing-2xl) var(--spacing-lg);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-block;
          color: white;
          text-decoration: none;
          margin-bottom: var(--spacing-md);
          opacity: 0.9;
        }

        .back-link:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .page-header h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
          color: white;
        }

        .repo-url a {
          color: white;
          opacity: 0.9;
        }

        .page-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-lg);
        }

        .loading-container,
        .error-container,
        .not-scanned {
          text-align: center;
          padding: var(--spacing-2xl);
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
          margin: 0 auto var(--spacing-lg);
        }

        .files-header {
          margin-bottom: var(--spacing-xl);
        }

        .files-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .stat-card {
          background: white;
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .files-controls {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .search-input,
        .filter-select {
          flex: 1;
          min-width: 200px;
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
        }

        .files-list {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .files-table {
          width: 100%;
          border-collapse: collapse;
        }

        .files-table thead {
          background: var(--bg-tertiary);
        }

        .files-table th {
          padding: var(--spacing-md);
          text-align: left;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-color);
        }

        .files-table td {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--border-color);
        }

        .files-table tbody tr:hover {
          background: var(--bg-secondary);
        }

        .file-icon {
          font-size: 1.5rem;
          text-align: center;
        }

        .file-name {
          font-weight: 500;
          color: var(--text-primary);
        }

        .file-path {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-family: monospace;
        }

        .file-extension {
          color: var(--text-secondary);
          font-family: monospace;
        }

        .file-size {
          color: var(--text-secondary);
          text-align: right;
        }

        .no-files {
          padding: var(--spacing-2xl);
          text-align: center;
          color: var(--text-secondary);
        }

        .files-footer {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md);
          text-align: center;
          color: var(--text-secondary);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .files-table {
            font-size: 0.875rem;
          }

          .files-table th,
          .files-table td {
            padding: var(--spacing-sm);
          }

          .file-path {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositoryFiles;
