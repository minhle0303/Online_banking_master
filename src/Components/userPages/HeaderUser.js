import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderUser({ title1, links }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();  // Hook from React Router for navigation

  const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
console.log(userToken.data.fisrtName);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    // Clear user token and refresh token from local storage
    localStorage.removeItem("tokenData");
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="header-user">
      <div className="user-menu">
        <div className="menu-circle" onClick={toggleMenu}>
          ☰
        </div>
        {showMenu && (
          <div className="menu-dropdown">
 <p>Hello, {userToken?.data?.firstName} {userToken?.data?.lastName}!</p>            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default HeaderUser;