import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Cheque() {
    const today = new Date().toISOString().substring(0, 10);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [issueDate, setIssueDate] = useState(today);
    const [payeeName, setPayeeName] = useState('');
    const [amount, setAmount] = useState('');
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));

    async function refreshToken() {
        try {
            const response = await axios.post("http://localhost:5244/api/Auth/refresh-token", {
                refreshToken: userToken.refreshToken
            });
            localStorage.setItem("tokenData", JSON.stringify(response.data));
            setUserToken(response.data);
            return response.data.token; // Return new token
        } catch (error) {
            console.error("Error refreshing token:", error);
            setError('Failed to refresh token');
        }
    }

    async function fetchAccounts() {
        try {
            const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            setAccounts(response.data.accounts);
            if (response.data.accounts.length > 0) {
                setSelectedAccount(response.data.accounts[0]);
            }
        } catch (err) {
            console.error("Error fetching accounts:", err);
            if (err.response?.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    fetchAccounts(); // Retry fetch accounts after refreshing token
                }
            } else {
                setError('Failed to fetch account data');
            }
        }
    }

    useEffect(() => {
        fetchAccounts();
    }, [userToken]);

    const handleAccountChange = (e) => {
        const accountId = parseInt(e.target.value);
        const account = accounts.find(acc => acc.accountId === accountId);
        setSelectedAccount(account);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedAccount) {
            setError('No account selected');
            return;
        }

        const chequeData = {
            accountId: selectedAccount.accountId,
            chequeNumber: "string", // Assume backend handles this
            issueDate,
            payeeName,
            amount,
            status: "Issued"
        };

        if (parseFloat(amount) > parseFloat(selectedAccount.balance)) {
            setError("Insufficient funds.");
            return;
        }

        try {
            const issueResponse = await axios.post(`http://localhost:5244/api/Account/Cheque`, chequeData, {
                headers: { 'Authorization': `Bearer ${userToken.token}` }
            });
            if (issueResponse.status === 200) {
                setNotification('Cheque issued successfully!');
                setPayeeName('');
                setAmount('');
            } else {
                throw new Error(issueResponse.data.errorMessage || "Issue failed");
            }
        } catch (error) {
            console.error("Failed to issue the cheque:", error);
            setError(error.response?.data?.message || "Failed to issue the cheque due to a network error.");
        }
    };

    return (
        <div className='main-content-user'>
        <div className="transfer-container">
            <h3>Issue Cheque</h3>
            <hr />
            {error && <div className="alert alert-danger">{error}</div>}
                        {notification && <div className="alert alert-success">{notification}</div>}
           
            <form className="isssue-form" onSubmit={handleSubmit}>
                {accounts.length > 0 && (
                    <div className="mb-3">
                        <label htmlFor="accountSelect" className="form-label">Select Account:</label> <br />
                        <select className="select-form-control" id="accountSelect" onChange={handleAccountChange} value={selectedAccount?.accountId}>
                            {accounts.map((acc) => (
                                <option key={acc.accountId} value={acc.accountId}>
                                    {acc.accountNumber} - Balance: {acc.balance}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="issueDate" className="form-label">Issue Date</label>
                    <input type="date" className="select-form-control" id="issueDate" value={issueDate} onChange={e => setIssueDate(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="payeeName" className="form-label">Payee Name</label>
                    <input type="text" className="select-form-control" id="payeeName" value={payeeName} onChange={e => setPayeeName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input type="number" className="select-form-control" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Issue Cheque</button>
            </form>
           
        </div>
    </div>
    );
}

export default Cheque;
