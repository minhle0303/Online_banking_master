import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../images/Online-Banking (1)-fotor-2024072118758.png';

function Sidebar() {
  const [isBillsOpen, setIsBillsOpen] = useState(false);

  // Toggle the visibility of the Bills submenu
  const toggleBills = () => {
    setIsBillsOpen(!isBillsOpen);
  };

  return (
    <div className="sidebar-user">
      <div className="logo-user">
        <img src={logo} alt="TPBank" />
      </div>
      <div className="search-bar">
    <input type="text" placeholder="Tìm kiếm tính năng..." />
  </div>
      <div className="menu-user">
        <NavLink to="/user/home" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Home
        </NavLink>
        <NavLink to="/user/transfer" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Transfer
        </NavLink>
        <NavLink to="/user/cheque" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Cheque
        </NavLink>
        <div className="menu-item-user" onClick={toggleBills}>
          Bills <span className="arrow">{isBillsOpen ? '▲' : '▼'}</span>
        </div>
        {isBillsOpen && (
          <div className="submenu">
            <NavLink to="/user/transfer" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
              Bills Electric
            </NavLink>
            <NavLink to="/user/transfer" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
              Bills Water
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
