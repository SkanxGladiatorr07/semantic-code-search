import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Semantic Code Search</h1>
          <p className="hero-subtitle">
            Import GitHub repositories to search, analyze, and understand codebases with AI-powered insights
          </p>
          <div className="cta-buttons">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/repositories" className="btn btn-outline-primary btn-lg">
              View Repositories
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="features-title">Features</h2>
        <div className="grid grid-4">
          <div className="card feature-card">
            <div className="feature-icon">📦</div>
            <h3>Repository Import</h3>
            <p>Import any public GitHub repository with a single click</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Semantic Search</h3>
            <p>Search code using natural language and find relevant snippets instantly</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon">📊</div>
            <h3>Code Analysis</h3>
            <p>Get insights into code structure, complexity, and patterns</p>
          </div>
          
          <div className="card feature-card">
            <div className="feature-icon">💬</div>
            <h3>AI Assistant</h3>
            <p>Ask questions about the codebase and get intelligent answers</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
