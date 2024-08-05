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
      <hr />
      <div className="search-bar">
        <input type="text" placeholder="Search functionality...." />
      </div>
      <div className="menu-user">
        <NavLink to="/user/home" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Home
        </NavLink>
        <NavLink to="/user/transaction" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Transactions History
        </NavLink>
        <NavLink to="/user/transfer" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Transfer
        </NavLink>
        <NavLink to="/user/loan" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Loan 
        </NavLink>
        <NavLink to="/user/cheque" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Cheque
        </NavLink>
        <NavLink to="/user/service-rq" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Service Request
        </NavLink>
        <NavLink to="/user/foreign-currency" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
          Foreign Currency
        </NavLink>

        <div className="menu-item-user" onClick={() => toggleDropdown('bills')}>
          Bills <span className="arrow">{openDropdown === 'bills' ? '▲' : '▼'}</span>
        </div>
        {openDropdown === 'bills' && (
          <div className="submenu">
            <NavLink to="/user/bills-electric" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
              Bills Electric
            </NavLink>
            <NavLink to="/user/bills-water" className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}>
              Bills Water
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
