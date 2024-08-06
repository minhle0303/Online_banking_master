import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../images/Online-Banking (1)-fotor-2024072118758.png';

function Sidebar() {
  const menuItems = [
    { name: 'Home', path: '/user/home' },
    { name: 'Transactions History', path: '/user/transaction' },
    { name: 'Transfer', path: '/user/transfer' },
    { name: 'Loan', path: '/user/loan' },
    { name: 'Cheque', path: '/user/cheque' },
    { name: 'Service Request', path: '/user/service-rq' },
    { name: 'Foreign Currency', path: '/user/foreign-currency' },
    { name: 'Setting', path: '/user/setting' },
  ];
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const filteredMenuItems = searchText ? menuItems.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  ) : menuItems;

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchText(''); // Clear search input after navigation
  };

  return (
    <div className="sidebar-user">
      <div className="logo-user">
        <img src={logo} alt="TPBank" />
      </div>
      <hr />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search functionality..."
          value={searchText}
          onChange={handleSearchChange}
        />
        {searchText && (
          <div className="search-results">
            {filteredMenuItems.map(item => (
              <div key={item.path} className="search-result-item" onClick={() => handleSearchSelect(item.path)}>
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="menu-user">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => isActive ? "menu-item-user active" : "menu-item-user"}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
