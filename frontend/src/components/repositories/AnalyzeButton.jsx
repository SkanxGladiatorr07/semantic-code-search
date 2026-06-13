/**
 * Analyze Button Component
 * Button to trigger repository analysis
 */

import { useState } from 'react';
import { analyzeRepository } from '../../services/api';

const AnalyzeButton = ({ repository, onAnalyzeComplete }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeRepository(repository.id);
      
      if (onAnalyzeComplete) {
        onAnalyzeComplete(result.data);
      }
    } catch (err) {
      console.error('Error analyzing repository:', err);
      setError(err.message || 'Failed to analyze repository');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="analyze-button-container">
      <button
        onClick={handleAnalyze}
        disabled={analyzing || repository.scan_status !== 'completed'}
        className={`analyze-button ${analyzing ? 'analyzing' : ''}`}
        title={repository.scan_status !== 'completed' ? 'Repository must be scanned first' : ''}
      >
        {analyzing ? (
          <>
            <span className="spinner-small"></span>
            Analyzing...
          </>
        ) : (
          <>🔬 Analyze Repository</>
        )}
      </button>

      {error && (
        <div className="analyze-error">
          <span style={{ color: 'red', fontSize: '0.875rem' }}>
            ❌ {error}
          </span>
        </div>
      )}

      <style jsx>{`
        .analyze-button-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .analyze-button {
          padding: 8px 16px;
          background: var(--secondary-color);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          transition: all 0.2s;
        }

        .analyze-button:hover:not(:disabled) {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .analyze-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnalyzeButton;
