import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div>
      <nav className="top-nav">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          🏠 Home
        </Link>
        <Link 
          to="/about" 
          className={location.pathname === '/about' ? 'active' : ''}
        >
          ℹ️ About
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
