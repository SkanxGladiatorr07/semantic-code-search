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
      
      <style jsx>{`
        .app-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
        }
        
        .main-content {
          flex: 1;
          padding-top: 70px;
        }
        
        @media (max-width: 480px) {
          .main-content {
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
