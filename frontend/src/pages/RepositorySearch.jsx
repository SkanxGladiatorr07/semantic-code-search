/**
 * Repository Search Page
 * Search symbols within a repository
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositoryById, searchRepositorySymbols } from '../services/api';

const RepositorySearch = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [symbolType, setSymbolType] = useState('');
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchRepository();
  }, [id]);

  const fetchRepository = async () => {
    try {
      const response = await getRepositoryById(id);
      setRepository(response.data);
    } catch (err) {
      console.error('Error fetching repository:', err);
      setError('Failed to load repository information');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchRepositorySymbols(id, searchQuery.trim(), symbolType || null);
      setResults(response.data.symbols || []);
      setStatistics(response.data.statistics || null);
    } catch (err) {
      console.error('Error searching symbols:', err);
      setError(err.message || 'Failed to search symbols');
      setResults([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSymbolType('');
    setResults([]);
    setStatistics(null);
    setHasSearched(false);
    setError(null);
  };

  const groupByFile = (symbols) => {
    const grouped = {};
    symbols.forEach(symbol => {
      const key = symbol.file_path;
      if (!grouped[key]) {
        grouped[key] = {
          file_name: symbol.file_name,
          file_path: symbol.file_path,
          file_extension: symbol.file_extension,
          symbols: []
        };
      }
      grouped[key].symbols.push(symbol);
    });
    return Object.values(grouped);
  };

  const getSymbolIcon = (type) => {
    switch (type) {
      case 'function':
        return '⚡';
      case 'class':
        return '📦';
      case 'interface':
        return '🔷';
      default:
        return '📄';
    }
  };

  const getSymbolColor = (type) => {
    switch (type) {
      case 'function':
        return '#3b82f6';
      case 'class':
        return '#10b981';
      case 'interface':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="repository-search-container">
      <div className="search-header">
        <div className="breadcrumb">
          <Link to="/repositories" className="breadcrumb-link">Repositories</Link>
          <span className="breadcrumb-separator">/</span>
          {repository && (
            <>
              <Link to={`/repositories/${id}/symbols`} className="breadcrumb-link">
                {repository.repository_name}
              </Link>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span className="breadcrumb-current">Search</span>
        </div>
        
        <h2>Search Symbols</h2>
        {repository && (
          <p className="search-subtitle">
            Search functions, classes, and interfaces in {repository.repository_name}
          </p>
        )}
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by symbol name..."
            className="search-input"
            disabled={loading}
          />
          
          <select
            value={symbolType}
            onChange={(e) => setSymbolType(e.target.value)}
            className="type-filter"
            disabled={loading}
          >
            <option value="">All Types</option>
            <option value="function">Functions</option>
            <option value="class">Classes</option>
            <option value="interface">Interfaces</option>
          </select>
        </div>

        <div className="search-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
          
          {(searchQuery || symbolType || hasSearched) && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-secondary"
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {statistics && (
        <div className="search-stats">
          <div className="stat-card">
            <span className="stat-value">{statistics.total}</span>
            <span className="stat-label">Total Results</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.functions}</span>
            <span className="stat-label">Functions</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.classes}</span>
            <span className="stat-label">Classes</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{statistics.interfaces}</span>
            <span className="stat-label">Interfaces</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching symbols...</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>
            No symbols matching "{searchQuery}"
            {symbolType && ` with type "${symbolType}"`}
          </p>
          <p className="empty-hint">Try a different search term or remove filters</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          {groupByFile(results).map((fileGroup, idx) => (
            <div key={idx} className="file-group">
              <div className="file-header">
                <span className="file-icon">📄</span>
                <div className="file-info">
                  <h3 className="file-name">{fileGroup.file_name}</h3>
                  <p className="file-path">{fileGroup.file_path}</p>
                </div>
                <span className="symbol-count">
                  {fileGroup.symbols.length} {fileGroup.symbols.length === 1 ? 'symbol' : 'symbols'}
                </span>
              </div>

              <div className="symbols-list">
                {fileGroup.symbols.map((symbol) => (
                  <div key={symbol.id} className="symbol-item">
                    <span className="symbol-icon">{getSymbolIcon(symbol.symbol_type)}</span>
                    <div className="symbol-info">
                      <span className="symbol-name">{symbol.symbol_name}</span>
                      <span
                        className="symbol-type-badge"
                        style={{ backgroundColor: getSymbolColor(symbol.symbol_type) }}
                      >
                        {symbol.symbol_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .repository-search-container {
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-header {
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

        .search-header h2 {
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
        }

        .search-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .search-form {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .search-input-container {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
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

        .type-filter {
          padding: var(--spacing-md);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
          background: white;
          cursor: pointer;
          min-width: 150px;
        }

        .type-filter:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .search-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .search-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary-color);
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .error-message {
          background: #fee2e2;
          color: var(--error-color);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-lg);
        }

        .loading-state {
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

        .empty-hint {
          margin-top: var(--spacing-md);
          font-size: 0.875rem;
        }

        .search-results {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .file-group {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .file-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: #f9fafb;
          border-bottom: 1px solid var(--border-color);
        }

        .file-icon {
          font-size: 1.5rem;
        }

        .file-info {
          flex: 1;
        }

        .file-name {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          margin-bottom: var(--spacing-xs);
        }

        .file-path {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .symbol-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .symbols-list {
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .symbol-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }

        .symbol-item:hover {
          background: #f9fafb;
        }

        .symbol-icon {
          font-size: 1.25rem;
        }

        .symbol-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .symbol-name {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .symbol-type-badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .search-input-container {
            flex-direction: column;
          }

          .type-filter {
            width: 100%;
          }

          .search-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .file-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .symbol-count {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositorySearch;
