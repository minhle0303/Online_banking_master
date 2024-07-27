import React, { useEffect, useState } from 'react';
import Card from './Card';
import Header from './HeaderUser';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import iconTransfer from './icons/transfer.png';
import iconAccount from './icons/account.png';
import iconBill from './icons/bill.png';
import iconCurrency from './icons/currency.png';
import iconSupport from './icons/support.png';
import iconHistory from './icons/history.png';
import iconCheque from './icons/cheque.png';

function MainContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
  // console.log("userToken APi: ", userToken);
  // console.log("userToken: ", userToken.data.userId);

  async function refreshToken() {
    try {
      const response = await axios.post("http://localhost:5244/api/Auth/refresh-token", {
        refreshToken: userToken?.refreshToken
      });
      localStorage.setItem("tokenData", JSON.stringify(response.data));
      setUserToken(response.data);
      return response.data.token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Failed to refresh token");
    }
  }

  async function handleFetchUsers() {
    if (!userToken || !userToken.data) {
      console.error("No user token available.");
      return; // Optionally redirect to login
    }

    try {
      const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
        headers: {
          'Authorization': 'Bearer ' + userToken?.token
        }
      });
      // Assuming response.data contains the user data and accounts as shown in your server response
      setUsers(response.data); // If you want to store the entire user object
      setAccounts(response.data.accounts); // This ensures the accounts array is updated correctly
      console.log("API Response:", response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (err.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          handleFetchUsers(); // No need to pass newToken since setUserToken updates the context
        } catch (refreshError) {
          console.error("Unauthorized and unable to refresh token", refreshError);
        }
      }
    }
  }

  useEffect(() => {
    handleFetchUsers();
  }, [userToken]);


  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + accounts.length) % accounts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % accounts.length);
  };
  const cards = [
    { icon: iconTransfer, title: 'Tranfers',path: '/user/transfer' },
    { icon: iconBill, title: 'Bills' },
    { icon: iconCurrency, title: 'Foreign Currency' },
    { icon: iconSupport, title: 'Support Service' },
    { icon: iconAccount, title: 'Open Account',path: '/user/open-account' },
    { icon: iconHistory, title: 'Transaction History' },
    { icon: iconCheque, title: 'Cheque',path: '/user/cheque'  },




    // Add more cards as needed
  ];

  return (
    <div className="main-content-user">
      <div className="card-slider">
        <button onClick={handlePrev} className="nav-button">＜</button>
        <div className="card">
          {accounts.length > 0 && (
            <>
              <div className="account-number">Account ID: {accounts[currentIndex].accountNumber}</div>
              <div className="balance">Balance: {accounts[currentIndex].balance} VND</div>
              <div className="description">Type: {accounts[currentIndex].typeAccountId}</div> {/* Adjust if you have description */}
            </>
          )}
          <button className="action-button" onClick={() => navigate('/user/transfer')}>Transfer</button>
          <button className="action-button" onClick={() => navigate('/user/open-account')}>Open Account</button>        </div>
        <button onClick={handleNext} className="nav-button">＞</button>
      </div>
      <div className="cards-user">
        {cards.map((card, index) => (
          <Card key={index} icon={card.icon} title={card.title}   onClick={() => navigate(card.path)}/>
        ))}
      </div>
    </div>
  );
}

export default MainContent;