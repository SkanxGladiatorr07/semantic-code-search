import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositoryInsights } from '../services/api';
import LoadingOverlay from '../components/common/LoadingOverlay';

const RepositoryInsights = () => {
  const { id } = useParams();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, [id]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRepositoryInsights(id);
      
      if (!response?.data) {
        throw new Error('No insights data received');
      }

      setInsights(response.data);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError(err.userMessage || err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="insights-container">
      {loading && <LoadingOverlay message="Loading insights..." />}
      {!loading && error && (
        <div className="error-state">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={fetchInsights} className="btn btn-primary">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && insights && (
        <>
          <div className="insights-header">
            <div className="breadcrumb">
              <Link to="/repositories" className="breadcrumb-link">Repositories</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to={`/repositories`} className="breadcrumb-link">
                {insights.repository.repository_name}
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Insights</span>
            </div>

            <h2>📊 Repository Insights</h2>
            <p className="insights-subtitle">
              Detailed statistics and analysis for {insights.repository.repository_name}
            </p>
          </div>

          <div className="insights-grid">
            <div className="insight-card primary-card">
              <div className="card-icon">📦</div>
              <div className="card-content">
                <h3>Repository</h3>
                <p className="card-title">{insights.repository.repository_name}</p>
                {insights.repository.description && (
                  <p className="card-description">{insights.repository.description}</p>
                )}
                <a
                  href={insights.repository.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  🐙 View on GitHub →
                </a>
              </div>
            </div>

            <div className="insight-card">
              <div className="card-icon">📄</div>
              <div className="card-content">
                <h3>Total Files</h3>
                <p className="card-value">{insights.statistics.total_files.toLocaleString()}</p>
                <p className="card-label">Scanned files</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="card-icon">🔢</div>
              <div className="card-content">
                <h3>Total Symbols</h3>
                <p className="card-value">{insights.statistics.total_symbols.toLocaleString()}</p>
                <p className="card-label">Functions, classes & interfaces</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="card-icon">⚡</div>
              <div className="card-content">
                <h3>Functions</h3>
                <p className="card-value">{insights.statistics.total_functions.toLocaleString()}</p>
                <p className="card-label">Total functions detected</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="card-icon">📦</div>
              <div className="card-content">
                <h3>Classes</h3>
                <p className="card-value">{insights.statistics.total_classes.toLocaleString()}</p>
                <p className="card-label">Total classes detected</p>
              </div>
            </div>

            <div className="insight-card">
              <div className="card-icon">🔷</div>
              <div className="card-content">
                <h3>Interfaces</h3>
                <p className="card-value">{insights.statistics.total_interfaces.toLocaleString()}</p>
                <p className="card-label">Total interfaces detected</p>
              </div>
            </div>

            <div className="insight-card scan-card">
              <div className="card-icon">🕐</div>
              <div className="card-content">
                <h3>Last Scan</h3>
                <p className="card-date">{formatDate(insights.last_scan_date)}</p>
                <p className="card-label">
                  Status: <span className={`status-badge ${insights.repository.scan_status}`}>
                    {insights.repository.scan_status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {insights.file_types && insights.file_types.length > 0 && (
            <div className="file-types-section">
              <h3>📁 File Types Distribution</h3>
              <div className="file-types-grid">
                {insights.file_types.map((type, index) => (
                  <div key={index} className="file-type-item">
                    <span className="file-extension">{type.file_extension || 'No extension'}</span>
                    <span className="file-count">{type.count} files</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="insights-actions">
            <Link to={`/repositories/${id}/chat`} className="btn btn-primary">
              💬 Chat with Repository
            </Link>
            <Link to={`/repositories/${id}/search`} className="btn btn-secondary">
              🔍 Search Symbols
            </Link>
            <Link to={`/repositories/${id}/symbols`} className="btn btn-secondary">
              📊 View All Symbols
            </Link>
          </div>
        </>
      )}

      <style jsx>{`
        .insights-container {
          padding: var(--spacing-lg);
          max-width: 1400px;
          margin: 0 auto;
        }

        .insights-header {
          margin-bottom: var(--spacing-xl);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
          font-size: 0.875rem;
        }

        .breadcrumb-link {
          color: var(--primary-color);
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: var(--text-light);
        }

        .breadcrumb-current {
          color: var(--text-secondary);
        }

        .insights-header h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
        }

        .insights-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .insight-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          transition: all var(--transition-medium);
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
        }

        .insight-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .primary-card {
          grid-column: 1 / -1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .primary-card h3,
        .primary-card .card-title,
        .primary-card .card-description {
          color: white;
        }

        .scan-card {
          grid-column: 1 / -1;
          background: #f0f9ff;
        }

        .card-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .card-content {
          flex: 1;
        }

        .card-content h3 {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--text-primary);
        }

        .card-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-md) 0;
          line-height: 1.5;
        }

        .card-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--primary-color);
          margin: 0;
          line-height: 1;
        }

        .card-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: var(--spacing-xs) 0 0 0;
        }

        .card-date {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .github-link {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .github-link:hover {
          color: white;
          text-decoration: underline;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .file-types-section {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .file-types-section h3 {
          margin: 0 0 var(--spacing-lg) 0;
          font-size: 1.25rem;
        }

        .file-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .file-type-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          background: #f9fafb;
          border-radius: var(--radius-md);
        }

        .file-extension {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: var(--text-primary);
        }

        .file-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .insights-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          justify-content: center;
        }

        .loading-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          border-top-color: var(--primary-color);
          animation: spin 1s linear infinite;
          margin-bottom: var(--spacing-lg);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }

          .primary-card,
          .scan-card {
            grid-column: 1;
          }

          .insights-actions {
            flex-direction: column;
          }

          .insights-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositoryInsights;
