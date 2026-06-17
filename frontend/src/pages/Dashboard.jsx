import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHealthStatus } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        const data = await getHealthStatus();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching health data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="page-container dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Manage your repositories and perform code searches
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="card-title">Server Status</h2>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Checking server...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p><strong>❌ {error}</strong></p>
              <p>Please make sure the backend is running.</p>
            </div>
          ) : (
            <div className="status-info">
              <div className="status-row">
                <span className="status-label">Status:</span>
                <span className="status-success">✅ {healthData?.message}</span>
              </div>
              <div className="status-row">
                <span className="status-label">Environment:</span>
                <span className="status-value">{healthData?.environment}</span>
              </div>
              <div className="status-row">
                <span className="status-label">Service:</span>
                <span className="status-value">{healthData?.service}</span>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">Repository Management</h2>
          <p className="card-description">
            Add, view, and manage your GitHub repositories
          </p>
          <Link to="/repositories" className="btn btn-primary">
            Go to Repositories →
          </Link>
        </div>

        <div className="card">
          <h2 className="card-title">Quick Actions</h2>
          <div className="btn-group-vertical">
            <Link to="/repositories" className="btn btn-outline-primary">
              📦 View All Repositories
            </Link>
            <button className="btn btn-outline-secondary" disabled>
              📊 View Analytics
            </button>
            <button className="btn btn-outline-secondary" disabled>
              🔍 Recent Searches
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Getting Started</h2>
          <ol className="getting-started-list">
            <li>Add a repository from the Repositories page</li>
            <li>Scan the repository to index files</li>
            <li>Analyze code to extract symbols</li>
            <li>Search and chat with your code!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
