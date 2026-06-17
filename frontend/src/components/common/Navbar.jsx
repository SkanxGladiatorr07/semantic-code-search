import { Link, useLocation } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
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
