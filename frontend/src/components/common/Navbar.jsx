/**
 * Navbar Component
 * Navigation bar displayed across all pages
 * Provides links to main application sections
 */

import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkServerHealth } from '../../services/api';

const Navbar = () => {
  const location = useLocation();
  const [serverStatus, setServerStatus] = useState('checking');

  // Check if current path matches the link
  const isActive = (path) => location.pathname === path;

  // Check server health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkServerHealth();
        setServerStatus(isHealthy ? 'online' : 'offline');
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          <span className="brand-text">Code Search</span>
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
        </ul>

        <div className="navbar-status">
          <span className={`status-indicator ${serverStatus}`}>
            {serverStatus === 'online' ? '● Online' : serverStatus === 'offline' ? '● Offline' : '○ Checking...'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
