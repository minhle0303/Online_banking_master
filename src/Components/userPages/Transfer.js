import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Transfer(props) {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [recipientName, setRecipientName] = useState('');
    const [amount, setAmount] = useState('');
    const [userPin, setUserPin] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const [transferDetails, setTransferDetails] = useState(null);
    const [showTransferDetails, setShowTransferDetails] = useState(false);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(''); // Notification message state

    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));

    async function refreshToken() {
        try {
            const response = await axios.post("http://localhost:5244/api/Auth/refresh-token", {
                refreshToken: userToken?.refreshToken
            });
            localStorage.setItem("tokenData", JSON.stringify(response.data));
            setUserToken(response.data);
        } catch (error) {
            console.error("Error refreshing token:", error);
            setError('Failed to refresh token');
        }
    }

    const handleSelectAccount = (accountId) => {
        const account = accounts.find(acc => acc.accountId === parseInt(accountId));
        setSelectedAccount(account);
    };

    async function handleFetchUsers() {
        if (!userToken || !userToken.data) {
            setError('No user token available.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken?.token
                }
            });
            setAccounts(response.data.accounts);
            if (response.data.accounts.length > 0) {
                setSelectedAccount(response.data.accounts[0]);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            if (err.response?.status === 401) {
                await refreshToken();
                handleFetchUsers();
            } else {
                setError('Failed to fetch user data');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchUsers();
    }, [userToken]);

    const handleAmountChange = (preset) => {
        setAmount(preset);
    };

    const closeModal = () => {
        setShowTransferDetails(false); // Function to close the modal
    };

    const fetchRecipientDetails = async (accountNumber) => {
        try {
            const response = await axios.get(`http://localhost:5244/api/Account/GetAccountByAccNo/${accountNumber}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken?.token
                }
            });
            setRecipientName(`${response.data.user.firstName} ${response.data.user.lastName}`);
        } catch (error) {
            console.error("Error fetching recipient details:", error);
            setRecipientName('');
        }
    };

    const handleRecipientAccountChange = (e) => {
        const accountNumber = e.target.value;
        setRecipientAccount(accountNumber);
        if (accountNumber) {
            fetchRecipientDetails(accountNumber);
        } else {
            setRecipientName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!recipientAccount || !amount||!userPin||!description){
            setError('Please enter all required fields!');
            return;

        }
        if (selectedAccount.accountNumber === recipientAccount) {
            setError("Cannot transfer to the same account.");
            setLoading(false);
            return;
        }

        try {
            const balanceCheck = await axios.get(`http://localhost:5244/api/Account/${selectedAccount.accountId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken?.token
                }
            });
            if (balanceCheck.data.balance < parseFloat(amount)) {
                setError("Insufficient funds.");
                setLoading(false);
                return;
            }
        } catch (balanceCheckError) {
            setError("Failed to verify account balance.");
            setLoading(false);
            return;
        }

        if (userPin !== userToken.data.pin) {
            setError("Incorrect Pin");
            setLoading(false);
            return;
        }
        

        try {
            const response = await axios.post("http://localhost:5244/api/Account/transfer", {
                fromAccountNumber: selectedAccount.accountNumber,
                toAccountNumber: recipientAccount,
                amount: parseFloat(amount),
                pin: userPin,
                description: description
            }, {
                headers: {
                    'Authorization': 'Bearer ' + userToken?.token
                }
            });
            if (response.status === 200) {
                setAmount('');
                setUserPin('');
                setRecipientAccount('');
                setDescription('');
                setRecipientName('');
                setTransferDetails({
                    fromAccount: selectedAccount.accountNumber,
                    toAccount: recipientAccount,
                    amountTransferred: amount,
                    transferDate: new Date().toLocaleString(),
                    description: description
                });
                handleFetchUsers(); // Refetch all user data to refresh the state
                setNotification('Transfer completed successfully!'); 
                setError('');

                setShowTransferDetails(true);
            } else {
                console.error("Transfer not completed:", response.data.errorMessage);
                setError(response.data.errorMessage || "Failed to complete transfer.");
            }
        } catch (error) {
            console.error("Transfer failed:", error.response?.data?.errorMessage || error.message);
            setError(error.response?.data?.errorMessage || "Transfer failed due to a network error.");
        } finally {
            setLoading(false);
        }
    };
    function renderMessage() {
        if (error) return <div className="alert alert-danger">{error}</div>;
        if (notification) return <div className="alert alert-success">{notification}</div>;
        return null; // Return null if neither are true
    }

    return (
        <div className='main-content-user'>
            <div className="transfer-container">
                <h3>Transfer In OnlineBanking</h3>
               {renderMessage()}
                <div className="account-info">
                    {selectedAccount && (
                        <div className="account-detail">
                            <span>From</span>
                            <div onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
                                <strong>{selectedAccount.accountNumber}</strong>
                                <p>{selectedAccount.balance} USD</p>
                                {showAccountDropdown && (
                                    <div className="account-dropdown">
                                        {accounts.map(account => (
                                            <div key={account.accountId} onClick={() => handleSelectAccount(account.accountId)}>
                                                {account.accountNumber} - {account.balance} VND
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                </div>
                <form className="transfer-form" onSubmit={handleSubmit}>
                    <label htmlFor="">To Account</label>
                    <input type="text" placeholder="To account number" value={recipientAccount} onChange={handleRecipientAccountChange}  />
                    {recipientName && <input type="text" placeholder="To account name" value={recipientName} readOnly />}
                    <label htmlFor="">Amount</label>
                    <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}  />
                    <div className="quick-amounts">
                        {[50, 100, 200, 300, 400, 500, 1000, 2000].map((amt) => (
                            <button key={amt} type="button" onClick={() => handleAmountChange(amt)}>{amt}</button>
                        ))}
                    </div>
                    <input type="password" placeholder="PIN" value={userPin} onChange={(e) => setUserPin(e.target.value)}  />
                    <textarea placeholder="Description" value={description}  onChange={(e) => setDescription(e.target.value)}></textarea>
                    <button type="submit" className="submit-btn" disabled={loading}>Transfer</button>
                </form>
                {showTransferDetails && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h1>Transfer Details</h1>
                            <p><strong>From Account:</strong> {transferDetails.fromAccount}</p>
                            <p><strong>To Account:</strong> {transferDetails.toAccount}</p>
                            <p><strong>Amount Transferred:</strong> {transferDetails.amountTransferred}</p>
                            <p><strong>Transfer Date:</strong> {transferDetails.transferDate}</p>
                            <p><strong>Description:</strong> {transferDetails.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Transfer;
