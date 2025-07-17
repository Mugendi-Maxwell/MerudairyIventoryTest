// Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className="custom-sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <ul className="sidebar-nav">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/inventory" className={location.pathname === '/inventory' ? 'active' : ''}>
            Inventory
          </Link>
        </li>
        <li>
          <Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
