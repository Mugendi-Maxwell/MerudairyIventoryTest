// Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="custom-sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <ul className="sidebar-nav">
        <li>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/inventory" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Inventory
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
