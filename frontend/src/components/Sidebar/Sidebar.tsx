import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaWpforms } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink 
            to="/admin/dashboard"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FaHome className="sidebar-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/forms"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FaWpforms className="sidebar-icon" /> Formulários
          </NavLink>
        </li>
      </ul>
    </div>
  )
}


export default Sidebar;
