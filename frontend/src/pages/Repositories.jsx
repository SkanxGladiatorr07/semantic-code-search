/**
 * Repositories Page Component
 * Main page for repository management
 */

import RepositoryList from '../components/repositories/RepositoryList';

const Repositories = () => {
  return (
    <div className="repositories-page">
      <div className="page-header">
        <h1>Repository Management</h1>
        <p className="page-subtitle">
          Import, manage, and organize your GitHub repositories for code search and analysis
        </p>
      </div>
      
      <div className="page-content">
        <RepositoryList />
      </div>
      
      <style jsx>{`
        .repositories-page {
          min-height: 100vh;
          background: var(--bg-secondary);
        }
        
        .page-header {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          padding: var(--spacing-2xl) var(--spacing-lg);
          text-align: center;
        }
        
        .page-header h1 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-sm);
          color: white;
        }
        
        .page-subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .page-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--spacing-xl) var(--spacing-lg);
        }
        
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }
          
          .page-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Repositories;