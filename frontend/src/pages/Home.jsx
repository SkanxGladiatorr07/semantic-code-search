/**
 * Home Page Component
 * Landing page with project introduction and features
 */

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <b>Welcome to Semantic Code Search</b>
          </h1>
          <p className="hero-subtitle">
            Import GitHub repositories to search, analyze, and understand codebases with AI-powered insights
          </p>
          <Link to="/dashboard" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Repository Import</h3>
            <p>Import any public GitHub repository with a single click</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Semantic Search</h3>
            <p>Search code using natural language and find relevant snippets instantly</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Code Analysis</h3>
            <p>Get insights into code structure, complexity, and patterns</p>
          </div>
          
          <div className="feature-card">
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
