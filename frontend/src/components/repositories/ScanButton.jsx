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

  const isCompleted = repository.scan_status === 'completed';
  const isScanning = scanning || repository.scan_status === 'scanning';

  return (
    <button
      onClick={handleScan}
      disabled={isScanning}
      className={`btn btn-sm ${isCompleted ? 'btn-success' : 'btn-primary'}`}
    >
      {isScanning ? '⏳ Scanning...' : isCompleted ? '✓ Scanned' : '📂 Scan'}
    </button>
  );
};

export default ScanButton;
