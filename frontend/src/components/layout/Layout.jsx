/**
 * Layout Component
 * Provides consistent layout structure across all pages
 * Includes the Navbar and wraps page content
 */

import Navbar from '../common/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Semantic Code Search.</p>
      </footer>
    </div>
  );
};

export default Layout;
