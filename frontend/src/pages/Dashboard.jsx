/**
 * Dashboard Page Component
 * Main workspace for repository management and search
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
                backend is not functional
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

        {/* Repository Management Card */}
        <div className="dashboard-card">
          <h2 className="card-title">My Repositories</h2>
          <div className="feature-info">
            <p>
              <strong>New Feature Available!</strong> You can now manage repositories.
            </p>
            <ul className="feature-list">
              <li>✅ Add new repositories with GitHub URLs</li>
              <li>✅ View all your imported repositories</li>
              <li>✅ Edit and delete repositories</li>
              <li>✅ Search through your repositories</li>
            </ul>
            <Link to="/repositories" className="feature-link">
              Go to Repository Management →
            </Link>
          </div>
        </div>

        <div className="dashboard-card placeholder-card">
          <h2 className="card-title">Recent Searches</h2>
          <p className="placeholder-text">
            Search history will be displayed here
          </p>
        </div>

        <div className="dashboard-card placeholder-card">
          <h2 className="card-title">Analytics</h2>
          <p className="placeholder-text">
            to be added
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
