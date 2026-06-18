/**
 * Repository Symbols Page
 * Displays extracted symbols (functions and classes) from a repository
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRepositorySymbols, getRepositoryById } from '../services/api';
import '../styles/RepositorySymbols.css';

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
      
      console.log('Symbols response:', symbolsResponse);
      console.log('Symbols data:', symbolsResponse.data);
      console.log('First symbol:', symbolsResponse.data.symbols[0]);
      
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
      filtered = filtered.filter(symbol => (symbol.type || symbol.symbol_type) === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter(symbol => 
        (symbol.name || symbol.symbol_name || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                  {groupedByFile.map((fileGroup, fileIndex) => (
                    <div key={`${fileGroup.file_path}-${fileIndex}`} className="file-group">
                      <h3 className="file-header">
                        📄 {fileGroup.file_name}
                        <span className="symbol-count">({fileGroup.symbols.length} symbols)</span>
                      </h3>
                      <div className="symbols-grid">
                        {fileGroup.symbols.map((symbol, symbolIndex) => (
                          <div key={`${symbol.id}-${symbol.symbol_name}-${symbolIndex}`} className="symbol-card" style={{background: '#f9fafb', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', minHeight: '80px'}}>
                            <div className="symbol-type-badge" data-type={symbol.type || symbol.symbol_type} style={{display: 'inline-flex', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px', background: (symbol.type || symbol.symbol_type) === 'function' ? '#dbeafe' : '#d1fae5', color: (symbol.type || symbol.symbol_type) === 'function' ? '#1e40af' : '#065f46'}}>
                              {(symbol.type || symbol.symbol_type) === 'function' && '⚡'}
                              {(symbol.type || symbol.symbol_type) === 'class' && '📦'}
                              {(symbol.type || symbol.symbol_type) === 'interface' && '🔷'}
                              {symbol.type || symbol.symbol_type}
                            </div>
                            <div className="symbol-name" style={{fontFamily: 'monospace', fontSize: '0.9375rem', color: '#111827', fontWeight: 600}}>{symbol.name || symbol.symbol_name}</div>
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
    </div>
  );
};

export default RepositorySymbols;
