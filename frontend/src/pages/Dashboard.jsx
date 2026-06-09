/**
 * Dashboard Page Component
 * Main workspace for repository management and search
 */

import { useState, useEffect } from 'react';
import { getHealthStatus } from '../services/api';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch server health data on component mount
  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const data = await getHealthStatus();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to server. Please make sure the backend is running.');
        console.error('Error fetching health data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage your repositories and perform code searches
        </p>
      </div>

      <div className="dashboard-content">
        {/* Server Status Card */}
        <div className="dashboard-card">
          <h2 className="card-title">Server Status</h2>
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : error ? (
            <div className="error-message">
              <p>❌ {error}</p>
              <p className="error-hint">
                Run <code>npm run dev</code> in the backend directory
              </p>
            </div>
          ) : (
            <div className="status-info">
              <div className="status-row">
                <span className="status-label">Status:</span>
                <span className="status-value success">✅ {healthData?.message}</span>
              </div>
              <div className="status-row">
                <span className="status-label">Environment:</span>
                <span className="status-value">{healthData?.environment}</span>
              </div>
              <div className="status-row">
                <span className="status-label">Uptime:</span>
                <span className="status-value">
                  {healthData?.uptime ? `${Math.floor(healthData.uptime)}s` : 'N/A'}
                </span>
              </div>
              <div className="status-row">
                <span className="status-label">Service:</span>
                <span className="status-value">{healthData?.service}</span>
              </div>
            </div>
          )}
        </div>

        {/* Placeholder Cards for Future Features */}
        <div className="dashboard-card placeholder-card">
          <h2 className="card-title">📦 My Repositories</h2>
          <p className="placeholder-text">
            Repository management will be implemented in the next phase
          </p>
        </div>

        <div className="dashboard-card placeholder-card">
          <h2 className="card-title">🔍 Recent Searches</h2>
          <p className="placeholder-text">
            Search history will be displayed here
          </p>
        </div>

        <div className="dashboard-card placeholder-card">
          <h2 className="card-title">📊 Analytics</h2>
          <p className="placeholder-text">
            Code analysis and statistics coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
