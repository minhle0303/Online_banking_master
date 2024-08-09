import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../images/Online-Banking (1)-fotor-2024072118758.png';

function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Toggle the visibility of a submenu
  const toggleDropdown = (menu) => {
    setOpenDropdown((prevMenu) => (prevMenu === menu ? null : menu));
  };

  return (
    <div className="sidebar-user">
      <div className="logo-user">
        <img src={logo} alt="TPBank" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search functionality..." />
      </div>
      <hr />
      <div className="menu-user">
       
        <NavLink to="/admin/userlist" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
          User List
        </NavLink>
        <NavLink to="/admin/accountlist" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
          Account List
        </NavLink>

        <div className="menu-item-user" onClick={() => toggleDropdown('fundsTransfer')}>
          Funds Transfer <span className="arrow">{openDropdown === 'fundsTransfer' ? '▲' : '▼'}</span>
        </div>
        {openDropdown === 'fundsTransfer' && (
          <div className="submenu">
            <NavLink to="/admin/transfer" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
              List Transfer
            </NavLink>
            <NavLink to="/admin/transfer-form" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
              Funds Transfer Form
            </NavLink>
          </div>
        )}

        <div className="menu-item-user" onClick={() => toggleDropdown('cheque')}>
          Cheque <span className="arrow">{openDropdown === 'cheque' ? '▲' : '▼'}</span>
        </div>
        {openDropdown === 'cheque' && (
          <div className="submenu">
            <NavLink to="/admin/cheque" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
              List Cheque
            </NavLink>
            <NavLink to="/admin/cheque-form" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
              Issue Cheque
            </NavLink>
          </div>
        )}

        <div className="menu-item-user" onClick={() => toggleDropdown('serviceRequest')}>
          Service Request <span className="arrow">{openDropdown === 'serviceRequest' ? '▲' : '▼'}</span>
        </div>
        {openDropdown === 'serviceRequest' && (
          <div className="submenu">
            <NavLink to="/admin/request-sv" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
              List Service Request
            </NavLink>
            <NavLink to="/admin/request-sv-form" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
              Create Request
            </NavLink>
          </div>
        )}

<NavLink to="/admin/loan" className={({ isActive }) => (isActive ? 'menu-item-user active' : 'menu-item-user')}>
         Loan
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
