// src/component/sidebar.jsx
import React from 'react';
import { FaHome, FaChartBar, FaEnvelope, FaMusic, FaTimes } from 'react-icons/fa';
import './sidebar.css';
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const navItems = [
    { id: 1, name: 'Home', icon: <FaHome /> },
    { id: 2, name: 'Statistics', icon: <FaChartBar /> },
    { id: 3, name: 'ContactUs', icon: <FaEnvelope /> }
  ];
 
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <FaMusic className="logo-icon" />
        <h2>Musicify</h2>
        <button className="close-sidebar" onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const path = `/${item.name}`;
          return (
            <Link 
              key={item.id} 
              to={path} 
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2025 Musicify App</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
}

export default Sidebar;
