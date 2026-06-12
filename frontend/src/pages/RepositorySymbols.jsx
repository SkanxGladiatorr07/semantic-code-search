/**
 * Repository Symbols Page
 * Displays extracted symbols (functions and classes) from a repository
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositorySymbols, getRepositoryById } from '../services/api';

const RepositorySymbols = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [symbolsResponse, repoResponse] = await Promise.all([
        getRepositorySymbols(id),
        getRepositoryById(id)
      ]);
      
      setData(symbolsResponse.data);
      setRepository(repoResponse.data);
    } catch (err) {
      console.error('Error fetching symbols:', err);
      setError(err.message || 'Failed to load symbols');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSymbols = () => {
    if (!data || !data.symbols) return [];

    let filtered = data.symbols;

    if (filterType) {
      filtered = filtered.filter(symbol => symbol.symbol_type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(symbol => 
        symbol.symbol_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const groupSymbolsByFile = () => {
    const filtered = getFilteredSymbols();
    const grouped = {};

    filtered.forEach(symbol => {
      const filePath = symbol.file_path;
      
      if (!grouped[filePath]) {
        grouped[filePath] = {
          file_path: filePath,
          file_name: symbol.file_name,
          symbols: []
        };
      }

      grouped[filePath].symbols.push(symbol);
    });

    return Object.values(grouped);
  };

  const filteredSymbols = getFilteredSymbols();
  const groupedByFile = groupSymbolsByFile();

  if (loading) {
    return (
      <div className="symbols-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading symbols...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="symbols-page">
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

  if (!data || !repository) {
    return (
      <div className="symbols-page">
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
    <div className="symbols-page">
      <div className="page-header">
        <div className="header-content">
          <Link to="/repositories" className="back-link">
            ← Back to Repositories
          </Link>
          <h1>Symbols: {data.repository_name}</h1>
          <p className="repo-url">
            <a href={repository.github_url} target="_blank" rel="noopener noreferrer">
              {repository.github_url}
            </a>
          </p>
        </div>
      </div>

      <div className="page-content">
        {data.symbols.length === 0 ? (
          <div className="no-symbols">
            <h2>No symbols found</h2>
            <p>Please analyze the repository first to extract symbols.</p>
            <Link to="/repositories" className="btn btn-primary">
              Go to Repositories
            </Link>
          </div>
        ) : (
          <>
            <div className="symbols-header">
              <div className="symbols-stats">
                <div className="stat-card">
                  <span className="stat-label">Total Symbols</span>
                  <span className="stat-value">{data.statistics.total}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Functions</span>
                  <span className="stat-value">{data.statistics.functions}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Classes</span>
                  <span className="stat-value">{data.statistics.classes}</span>
                </div>
                {data.statistics.interfaces > 0 && (
                  <div className="stat-card">
                    <span className="stat-label">Interfaces</span>
                    <span className="stat-value">{data.statistics.interfaces}</span>
                  </div>
                )}
              </div>

              <div className="symbols-controls">
                <input
                  type="text"
                  placeholder="Search symbols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All types</option>
                  <option value="function">Functions</option>
                  <option value="class">Classes</option>
                  <option value="interface">Interfaces</option>
                </select>
              </div>
            </div>

            <div className="symbols-list">
              {filteredSymbols.length === 0 ? (
                <div className="no-results">
                  <p>No symbols found matching your filters</p>
                </div>
              ) : (
                <div className="symbols-by-file">
                  {groupedByFile.map((fileGroup) => (
                    <div key={fileGroup.file_path} className="file-group">
                      <h3 className="file-header">
                        📄 {fileGroup.file_name}
                        <span className="symbol-count">({fileGroup.symbols.length} symbols)</span>
                      </h3>
                      <div className="symbols-grid">
                        {fileGroup.symbols.map((symbol) => (
                          <div key={symbol.id} className="symbol-card">
                            <div className="symbol-type-badge" data-type={symbol.symbol_type}>
                              {symbol.symbol_type === 'function' && '⚡'}
                              {symbol.symbol_type === 'class' && '📦'}
                              {symbol.symbol_type === 'interface' && '🔷'}
                              {symbol.symbol_type}
                            </div>
                            <div className="symbol-name">{symbol.symbol_name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="symbols-footer">
              <p>
                Showing {filteredSymbols.length} of {data.symbols.length} symbols
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .symbols-page {
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
        .no-symbols {
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

        .symbols-header {
          margin-bottom: var(--spacing-xl);
        }

        .symbols-stats {
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

        .symbols-controls {
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

        .symbols-by-file {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .file-group {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: var(--spacing-lg);
        }

        .file-header {
          font-size: 1.25rem;
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .symbol-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: normal;
        }

        .symbols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-md);
        }

        .symbol-card {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          transition: all var(--transition-fast);
        }

        .symbol-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .symbol-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          margin-bottom: var(--spacing-sm);
        }

        .symbol-type-badge[data-type="function"] {
          background: #dbeafe;
          color: #1e40af;
        }

        .symbol-type-badge[data-type="class"] {
          background: #d1fae5;
          color: #065f46;
        }

        .symbol-type-badge[data-type="interface"] {
          background: #fef3c7;
          color: #92400e;
        }

        .symbol-name {
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .no-results {
          padding: var(--spacing-2xl);
          text-align: center;
          color: var(--text-secondary);
        }

        .symbols-footer {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-color);
          color: var(--text-secondary);
          text-align: center;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .symbols-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RepositorySymbols;
