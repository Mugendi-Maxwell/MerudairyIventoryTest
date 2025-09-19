
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { Library } from 'lucide-react';

const Sidebar = () => {
  return (
    <nav className="custom-sidebar">
      <h2 className="sidebar-title"> Inventory Dashboard</h2>
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
            to="/admin/invite" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Admin invite
          </NavLink>
          <li></li>
          <NavLink 
            to="/issued-inventory" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Issued Inventory
          </NavLink>
          <li></li>
          <NavLink 
            to="/admin/signup" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Account
          </NavLink>
        </li>
        <li></li>
          <NavLink 
            to="/employees" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Employee Management
          </NavLink>
      </ul>
    </nav>
  );
};

export default Sidebar;
