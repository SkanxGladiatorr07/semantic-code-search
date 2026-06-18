import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const isActive = (path) => {
    if (path === '/repositories') {
      return location.pathname === path || location.pathname.startsWith('/repositories/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          <span className="brand-text">Semantic Code Search</span>
        </Link>
        
        <div className="navbar-links">
          <div className="theme-toggle-wrapper">
            <input
              type="checkbox"
              id="theme-toggle"
              className="theme-toggle-checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <label htmlFor="theme-toggle" className="theme-toggle-label">
              <span className="theme-toggle-slider">
                <span className="theme-icon">{darkMode ? '🌙' : '☀️'}</span>
              </span>
            </label>
          </div>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/repositories" 
            className={`nav-link ${isActive('/repositories') ? 'active' : ''}`}
          >
            Repositories
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
