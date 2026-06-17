import RepositoryList from '../components/repositories/RepositoryList';

const Repositories = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Repository Management</h1>
        <p className="page-subtitle">
          Import, manage, and organize your GitHub repositories for code search and analysis
        </p>
      </div>
      
      <RepositoryList />
    </div>
  );
};

export default Repositories;