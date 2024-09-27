import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaWpforms } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/admin/dashboard">
            <FaHome className="sidebar-icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/forms">
            <FaWpforms className="sidebar-icon" />
            <span>Formulários</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
