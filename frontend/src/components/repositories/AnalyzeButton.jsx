/**
 * Analyze Button Component
 * Button to trigger repository analysis
 */

import { useState } from 'react';
import { analyzeRepository } from '../../services/api';

const AnalyzeButton = ({ repository, onAnalyzeComplete, showToast }) => {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);

    try {
      const result = await analyzeRepository(repository.id);
      
      if (showToast) {
        showToast('Repository analyzed successfully!', 'success');
      }
      
      if (onAnalyzeComplete) {
        onAnalyzeComplete(result.data);
      }
    } catch (err) {
      console.error('Error analyzing repository:', err);
      if (showToast) {
        showToast(err.message || 'Failed to analyze repository', 'error');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const canAnalyze = repository.scan_status === 'completed';
  const isDisabled = !canAnalyze || analyzing;

  return (
    <button
      onClick={handleAnalyze}
      disabled={isDisabled}
      className="btn btn-sm btn-secondary"
      title={!canAnalyze ? 'Scan repository first' : ''}
    >
      {analyzing ? '⏳ Analyzing...' : '🔍 Analyze'}
    </button>
  );
};

export default AnalyzeButton;
