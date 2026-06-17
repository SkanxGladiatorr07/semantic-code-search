/**
 * Scan Button Component
 * Button to trigger repository scanning
 */

import { useState } from 'react';
import { scanRepository } from '../../services/api';

const ScanButton = ({ repository, onScanComplete, showToast }) => {
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);

    try {
      const result = await scanRepository(repository.id);
      
      if (showToast) {
        showToast('Repository scanned successfully!', 'success');
      }
      
      if (onScanComplete) {
        onScanComplete(result.data);
      }
    } catch (err) {
      console.error('Error scanning repository:', err);
      if (showToast) {
        showToast(err.message || 'Failed to scan repository', 'error');
      }
    } finally {
      setScanning(false);
    }
  };

  const getScanStatusColor = () => {
    switch (repository.scan_status) {
      case 'completed':
        return 'green';
      case 'scanning':
        return 'blue';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getScanStatusText = () => {
    switch (repository.scan_status) {
      case 'completed':
        return `Scanned (${repository.total_files} files)`;
      case 'scanning':
        return 'Scanning...';
      case 'failed':
        return 'Scan Failed';
      default:
        return 'Not Scanned';
    }
  };

  return (
    <div className="scan-button-container">
      <button
        onClick={handleScan}
        disabled={scanning || repository.scan_status === 'scanning'}
        className={`scan-button ${scanning ? 'scanning' : ''}`}
      >
        {scanning ? (
          <>
            <span className="spinner-small"></span>
            Scanning...
          </>
        ) : (
          <>📂 Scan Repository</>
        )}
      </button>

      <div className="scan-status">
        <span 
          className="status-badge" 
          style={{ 
            backgroundColor: getScanStatusColor(),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}
        >
          {getScanStatusText()}
        </span>
      </div>

      <style jsx>{`
        .scan-button-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .scan-button {
          padding: 8px 16px;
          background: var(--primary-color);
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

        .scan-button:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .scan-button:disabled {
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

        .scan-status {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScanButton;
