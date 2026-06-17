import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import '../../styles/buttons.css';
import '../../styles/layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
