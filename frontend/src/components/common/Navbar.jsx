import { Link, useLocation } from 'react-router-dom';

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
            to="/repositories" 
            className={`nav-link ${isActive('/repositories') ? 'active' : ''}`}
          >
            Repositories
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          z-index: 1000;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #111827;
          font-size: 1.25rem;
          font-weight: 700;
          transition: color 0.2s;
        }
        
        .navbar-brand:hover {
          color: #3b82f6;
        }
        
        .brand-icon {
          font-size: 1.75rem;
        }
        
        .brand-text {
          font-size: 1.25rem;
        }
        
        .navbar-links {
          display: flex;
          gap: 8px;
        }
        
        .nav-link {
          padding: 8px 20px;
          text-decoration: none;
          color: #6b7280;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 1rem;
        }
        
        .nav-link:hover {
          color: #3b82f6;
          background: #eff6ff;
        }
        
        .nav-link.active {
          color: #3b82f6;
          background: #dbeafe;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 16px;
          }
          
          .brand-text {
            display: none;
          }
          
          .navbar-links {
            gap: 4px;
          }
          
          .nav-link {
            padding: 6px 16px;
            font-size: 0.9375rem;
          }
        }
        
        @media (max-width: 480px) {
          .navbar {
            height: 60px;
          }
          
          .nav-link {
            padding: 6px 12px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
