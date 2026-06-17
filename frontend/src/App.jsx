import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import RepositoryFiles from './pages/RepositoryFiles';
import RepositorySymbols from './pages/RepositorySymbols';
import RepositorySearch from './pages/RepositorySearch';
import RepositoryChat from './pages/RepositoryChat';
import RepositoryInsights from './pages/RepositoryInsights';
import RepositorySummary from './pages/RepositorySummary';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="repositories/:id/files" element={<RepositoryFiles />} />
          <Route path="repositories/:id/symbols" element={<RepositorySymbols />} />
          <Route path="repositories/:id/search" element={<RepositorySearch />} />
          <Route path="repositories/:id/chat" element={<RepositoryChat />} />
          <Route path="repositories/:id/insights" element={<RepositoryInsights />} />
          <Route path="repositories/:id/summary" element={<RepositorySummary />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
