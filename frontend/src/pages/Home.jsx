import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import '../styles/Home.css';

const Home = () => {
  const features = [
    {
      icon: '📦',
      title: 'Repository Import',
      description: 'Import any public GitHub repository with a single click'
    },
    {
      icon: '🔍',
      title: 'Semantic Search',
      description: 'Search code using natural language and find relevant snippets instantly'
    },
    {
      icon: '📊',
      title: 'Code Analysis',
      description: 'Get insights into code structure, complexity, and patterns'
    },
    {
      icon: '💬',
      title: 'AI Assistant',
      description: 'Ask questions about the codebase and get intelligent answers'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Semantic Code Search</h1>
            <p className="hero-subtitle">
              Import GitHub repositories to search, analyze, and understand codebases with AI-powered insights
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                🚀 Get Started
              </Link>
              <Link to="/repositories" className="btn btn-primary btn-lg">
                📚 View Repositories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to explore and understand code repositories
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Card 
                key={index}
                icon={feature.icon}
                title={feature.title}
                hoverable={true}
                className="feature-card"
              >
                <p className="feature-description">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
