/**
 * Main App Component
 * Configures React Router and defines application routes
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import RepositoryFiles from './pages/RepositoryFiles';
import RepositorySymbols from './pages/RepositorySymbols';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/repositories" element={<Repositories />} />
          <Route path="/repositories/:id/files" element={<RepositoryFiles />} />
          <Route path="/repositories/:id/symbols" element={<RepositorySymbols />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
