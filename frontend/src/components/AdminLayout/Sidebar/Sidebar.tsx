import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaWpforms } from 'react-icons/fa';
import { FaMagnifyingGlassChart, FaUserShield } from "react-icons/fa6";
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
            <FaHome className="sidebar-icon" /> Resumo
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/data"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FaMagnifyingGlassChart className="sidebar-icon" /> Dados
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
        <li>
          <NavLink 
            to="/admin/register-admin"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <FaUserShield className="sidebar-icon" /> Registrar Admin
          </NavLink>
        </li>
      </ul>
    </div>
  )
}


export default Sidebar;
