import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHealthStatus } from '../services/api';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealth();
  }, []);

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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Manage your repositories and perform code searches
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Server Status Card */}
          <Card 
            title="Server Status" 
            icon="🖥️"
            className="status-card"
          >
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner-lg"></div>
                <p className="loading-text">Checking server...</p>
              </div>
            ) : error ? (
              <div className="error-state-inline">
                <p><strong>❌ {error}</strong></p>
                <p className="error-hint">Please make sure the backend is running.</p>
                <button onClick={fetchHealth} className="btn btn-primary btn-sm">
                  Retry Connection
                </button>
              </div>
            ) : (
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Status</span>
                  <div className="status-value">
                    <StatusBadge status="success">
                      ✅ {healthData?.message || 'Online'}
                    </StatusBadge>
                  </div>
                </div>
                <div className="status-item">
                  <span className="status-label">Environment</span>
                  <span className="status-value">{healthData?.environment || 'N/A'}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Service</span>
                  <span className="status-value">{healthData?.service || 'N/A'}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Repository Management Card */}
          <Card 
            title="Repository Management" 
            icon="📚"
          >
            <p className="card-description">
              Add, view, and manage your GitHub repositories
            </p>
            <Link to="/repositories" className="btn btn-primary btn-block">
              Go to Repositories →
            </Link>
          </Card>

          {/* Quick Actions Card */}
          <Card 
            title="Quick Actions" 
            icon="⚡"
          >
            <div className="btn-group-vertical">
              <Link to="/repositories" className="btn btn-outline">
                📦 View All Repositories
              </Link>
              <button className="btn btn-outline" disabled>
                📊 View Analytics
              </button>
              <button className="btn btn-outline" disabled>
                🔍 Recent Searches
              </button>
            </div>
          </Card>

          {/* Getting Started Card */}
          <Card 
            title="Getting Started" 
            icon="🚀"
            className="getting-started-card"
          >
            <ol className="steps-list">
              <li>
                <span className="step-number">1</span>
                <span className="step-text">Add a repository from the Repositories page</span>
              </li>
              <li>
                <span className="step-number">2</span>
                <span className="step-text">Scan the repository to index files</span>
              </li>
              <li>
                <span className="step-number">3</span>
                <span className="step-text">Analyze code to extract symbols</span>
              </li>
              <li>
                <span className="step-number">4</span>
                <span className="step-text">Search and chat with your code!</span>
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
