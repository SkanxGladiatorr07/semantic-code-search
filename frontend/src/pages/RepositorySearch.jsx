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
  const [expandedFiles, setExpandedFiles] = useState({});

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
      
      const initialExpanded = {};
      groupByFile(response.data.symbols || []).forEach((_, idx) => {
        initialExpanded[idx] = true;
      });
      setExpandedFiles(initialExpanded);
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
    setExpandedFiles({});
  };

  const toggleFileExpanded = (idx) => {
    setExpandedFiles(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
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

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? 
        <mark key={i} className="highlight">{part}</mark> : 
        part
    );
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
        
        <h2>🔍 Search Symbols</h2>
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
            autoFocus
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
          <p className="loading-hint">Scanning through {repository?.repository_name || 'repository'}</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p className="empty-query">
            No symbols matching <strong>"{searchQuery}"</strong>
            {symbolType && <span> with type <strong>"{symbolType}"</strong></span>}
          </p>
          <div className="empty-suggestions">
            <p className="suggestion-title">Try these suggestions:</p>
            <ul>
              <li>Check your spelling</li>
              <li>Try more general keywords</li>
              <li>Remove the type filter</li>
              <li>Search for partial names</li>
            </ul>
          </div>
          <button onClick={handleClear} className="btn btn-primary">
            Start New Search
          </button>
        </div>
      )}

      {!loading && !hasSearched && (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h3>Start Searching</h3>
          <p>Enter a symbol name to search through the repository</p>
          <div className="search-tips">
            <p className="tips-title">Search tips:</p>
            <ul>
              <li>Search is case-insensitive</li>
              <li>Use partial names for broader results</li>
              <li>Filter by type for specific results</li>
            </ul>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h3>Search Results</h3>
            <p className="results-count">
              Found <strong>{results.length}</strong> symbol{results.length !== 1 ? 's' : ''} 
              {' '}in <strong>{groupByFile(results).length}</strong> file{groupByFile(results).length !== 1 ? 's' : ''}
            </p>
          </div>

          {groupByFile(results).map((fileGroup, idx) => (
            <div key={idx} className="file-group">
              <div 
                className="file-header" 
                onClick={() => toggleFileExpanded(idx)}
                role="button"
                tabIndex={0}
              >
                <span className={`expand-icon ${expandedFiles[idx] ? 'expanded' : ''}`}>
                  ▶
                </span>
                <span className="file-icon">📄</span>
                <div className="file-info">
                  <h3 className="file-name">{fileGroup.file_name}</h3>
                  <p className="file-path">{fileGroup.file_path}</p>
                </div>
                <span className="symbol-count">
                  {fileGroup.symbols.length} {fileGroup.symbols.length === 1 ? 'symbol' : 'symbols'}
                </span>
              </div>

              {expandedFiles[idx] && (
                <div className="symbols-list">
                  {fileGroup.symbols.map((symbol) => (
                    <div key={symbol.id} className="symbol-item">
                      <span className="symbol-icon">{getSymbolIcon(symbol.symbol_type)}</span>
                      <div className="symbol-info">
                        <span className="symbol-name">
                          {highlightMatch(symbol.symbol_name, searchQuery)}
                        </span>
                        <span
                          className="symbol-type-badge"
                          style={{ backgroundColor: getSymbolColor(symbol.symbol_type) }}
                        >
                          {symbol.symbol_type}
                        </span>
                      </div>
                      <Link
                        to={`/repositories/${id}/symbols?highlight=${symbol.id}`}
                        className="view-details-link"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

        .loading-hint {
          font-size: 0.875rem;
          margin-top: var(--spacing-sm);
          color: var(--text-light);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
          opacity: 0.5;
        }

        .empty-state h3 {
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
          font-size: 1.5rem;
        }

        .empty-query {
          margin-bottom: var(--spacing-lg);
          font-size: 1rem;
        }

        .empty-suggestions {
          background: #f9fafb;
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          margin: var(--spacing-xl) auto;
          max-width: 500px;
          text-align: left;
        }

        .suggestion-title,
        .tips-title {
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
        }

        .empty-suggestions ul,
        .search-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .empty-suggestions li,
        .search-tips li {
          padding: var(--spacing-xs) 0;
          display: flex;
          align-items: center;
        }

        .empty-suggestions li:before,
        .search-tips li:before {
          content: "•";
          color: var(--primary-color);
          font-weight: bold;
          margin-right: var(--spacing-sm);
        }

        .search-tips {
          background: #f0f9ff;
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          margin: var(--spacing-xl) auto;
          max-width: 500px;
          text-align: left;
        }

        .results-header {
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 2px solid var(--border-color);
        }

        .results-header h3 {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 1.5rem;
        }

        .results-count {
          margin: 0;
          color: var(--text-secondary);
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
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: box-shadow var(--transition-fast);
        }

        .file-group:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .file-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: #f9fafb;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .file-header:hover {
          background: #f3f4f6;
        }

        .expand-icon {
          font-size: 0.75rem;
          transition: transform var(--transition-fast);
          color: var(--text-secondary);
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
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
          background: white;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
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
          border: 1px solid transparent;
        }

        .symbol-item:hover {
          background: #f9fafb;
          border-color: var(--border-color);
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

        .highlight {
          background: #fef08a;
          color: #854d0e;
          padding: 2px 4px;
          border-radius: 3px;
          font-weight: 600;
        }

        .symbol-type-badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .view-details-link {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .symbol-item:hover .view-details-link {
          opacity: 1;
        }

        .view-details-link:hover {
          text-decoration: underline;
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
            flex-wrap: wrap;
          }

          .symbol-count {
            width: 100%;
            text-align: center;
          }

          .symbol-item {
            flex-wrap: wrap;
          }

          .view-details-link {
            opacity: 1;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositorySearch;
