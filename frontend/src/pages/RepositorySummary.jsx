import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositoryById, generateRepositorySummary } from '../services/api';
import LoadingOverlay from '../components/common/LoadingOverlay';

const RepositorySummary = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const RepositorySummary = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepository();
  }, [id]);

  const fetchRepository = async () => {
    try {
      const response = await getRepositoryById(id);
      
      if (!response?.data) {
        setError('Repository data not available');
        return;
      }

      setRepository(response.data);
    } catch (err) {
      console.error('Error fetching repository:', err);
      setError(err.userMessage || 'Failed to load repository information');
    }
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateRepositorySummary(id);
      
      if (!response?.data) {
        throw new Error('No summary data received');
      }

      setSummary(response.data);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err.userMessage || err.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-container">
      {loading && <LoadingOverlay message="Generating summary..." submessage="Analyzing repository structure and code..." />}
      <div className="summary-header">
        <div className="breadcrumb">
          <Link to="/repositories" className="breadcrumb-link">Repositories</Link>
          <span className="breadcrumb-separator">/</span>
          {repository && (
            <>
              <Link to={`/repositories`} className="breadcrumb-link">
                {repository.repository_name}
              </Link>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span className="breadcrumb-current">Summary</span>
        </div>

        <h2>📝 Repository Summary</h2>
        {repository && (
          <p className="summary-subtitle">
            AI-generated summary for {repository.repository_name}
          </p>
        )}
      </div>

      {!summary && !loading && (
        <div className="generate-prompt">
          <div className="prompt-icon">🤖</div>
          <h3>Generate AI Summary</h3>
          <p>
            Generate a comprehensive AI-powered summary of this repository including
            technologies, architecture, major components, and key features.
          </p>
          <button
            onClick={handleGenerateSummary}
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            ✨ Generate Summary
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing repository and generating summary...</p>
          <p className="loading-hint">This may take a few moments</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={handleGenerateSummary} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}

      {summary && !loading && (
        <div className="summary-content">
          <div className="summary-actions">
            <button
              onClick={handleGenerateSummary}
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 Regenerate
            </button>
          </div>

          {summary.summary.overview && (
            <div className="summary-section">
              <h3>📋 Overview</h3>
              <p className="overview-text">{summary.summary.overview}</p>
            </div>
          )}

          {summary.summary.purpose && (
            <div className="summary-section">
              <h3>🎯 Purpose</h3>
              <p>{summary.summary.purpose}</p>
            </div>
          )}

          {summary.summary.technologies && summary.summary.technologies.length > 0 && (
            <div className="summary-section">
              <h3>🛠️ Technologies & Tools</h3>
              <div className="tech-grid">
                {summary.summary.technologies.map((tech, index) => (
                  <div key={index} className="tech-chip">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.summary.languages && summary.summary.languages.length > 0 && (
            <div className="summary-section">
              <h3>💻 Languages</h3>
              <div className="tech-grid">
                {summary.summary.languages.map((lang, index) => (
                  <div key={index} className="lang-chip">
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.summary.architecture && (
            <div className="summary-section">
              <h3>🏗️ Architecture</h3>
              <p>{summary.summary.architecture}</p>
            </div>
          )}

          {summary.summary.major_classes && summary.summary.major_classes.length > 0 && (
            <div className="summary-section">
              <h3>📦 Major Classes</h3>
              <div className="items-list">
                {summary.summary.major_classes.map((cls, index) => (
                  <div key={index} className="item-card">
                    <div className="item-header">
                      <span className="item-icon">📦</span>
                      <span className="item-name">{cls.name}</span>
                    </div>
                    <div className="item-meta">
                      <span className="item-file">📄 {cls.file}</span>
                    </div>
                    {cls.purpose && <p className="item-purpose">{cls.purpose}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.summary.major_functions && summary.summary.major_functions.length > 0 && (
            <div className="summary-section">
              <h3>⚡ Major Functions</h3>
              <div className="items-list">
                {summary.summary.major_functions.map((func, index) => (
                  <div key={index} className="item-card">
                    <div className="item-header">
                      <span className="item-icon">⚡</span>
                      <span className="item-name">{func.name}</span>
                    </div>
                    <div className="item-meta">
                      <span className="item-file">📄 {func.file}</span>
                    </div>
                    {func.purpose && <p className="item-purpose">{func.purpose}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.summary.key_features && summary.summary.key_features.length > 0 && (
            <div className="summary-section">
              <h3>✨ Key Features</h3>
              <ul className="features-list">
                {summary.summary.key_features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.summary.complexity && (
            <div className="summary-section">
              <h3>📊 Complexity Assessment</h3>
              <div className={`complexity-badge complexity-${summary.summary.complexity}`}>
                {summary.summary.complexity.toUpperCase()}
              </div>
            </div>
          )}

          <div className="summary-footer">
            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-label">Total Files:</span>
                <span className="stat-value">{summary.statistics.total_files}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Symbols:</span>
                <span className="stat-value">{summary.statistics.total_symbols}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Analyzed Files:</span>
                <span className="stat-value">{summary.statistics.analyzed_files}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .summary-container {
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        .summary-header {
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

        .summary-header h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
        }

        .summary-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .generate-prompt {
          background: var(--bg-primary);
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          text-align: center;
        }

        .prompt-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .generate-prompt h3 {
          margin-bottom: var(--spacing-md);
          font-size: 1.5rem;
        }

        .generate-prompt p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .btn-lg {
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: 1.125rem;
        }

        .loading-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
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

        .loading-hint {
          font-size: 0.875rem;
          color: var(--text-light);
          margin-top: var(--spacing-sm);
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .summary-actions {
          display: flex;
          justify-content: flex-end;
        }

        .summary-section {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
        }

        .summary-section h3 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .overview-text {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-primary);
        }

        .tech-grid {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .tech-chip,
        .lang-chip {
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .tech-chip {
          background: #dbeafe;
          color: #1e40af;
        }

        .lang-chip {
          background: #fef3c7;
          color: #92400e;
        }

        .items-list {
          display: grid;
          gap: var(--spacing-md);
        }

        .item-card {
          background: #f9fafb;
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xs);
        }

        .item-icon {
          font-size: 1.25rem;
        }

        .item-name {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          font-size: 1rem;
        }

        .item-meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .item-file {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .item-purpose {
          margin: var(--spacing-sm) 0 0 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .features-list {
          margin: 0;
          padding-left: var(--spacing-lg);
        }

        .features-list li {
          margin-bottom: var(--spacing-sm);
          line-height: 1.6;
        }

        .complexity-badge {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
        }

        .complexity-low {
          background: #d1fae5;
          color: #065f46;
        }

        .complexity-medium {
          background: #fef3c7;
          color: #92400e;
        }

        .complexity-high {
          background: #fee2e2;
          color: #991b1b;
        }

        .summary-footer {
          background: #f0f9ff;
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
        }

        .stats-row {
          display: flex;
          justify-content: space-around;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .summary-container {
            padding: var(--spacing-md);
          }

          .stats-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositorySummary;
