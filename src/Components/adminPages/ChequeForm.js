import React, { useState } from 'react';
import axios from 'axios';

function ChequeForm() {
    const today = new Date().toISOString().substring(0, 10);

    const [accountNumber, setAccountNumber] = useState('');
    const [issueDate, setIssueDate] = useState(today);
    const [payeeName, setPayeeName] = useState('');
    const [amount, setAmount] = useState('');
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [selectedAccount, setSelectedAccount] = useState(null);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setNotification('');

        try {
            const response = await axios.get(`http://localhost:5244/api/Account/GetAccountByAccNo/${accountNumber}`, {
                headers: { 'Authorization': `Bearer ${userToken.token}` }
            });
            setSelectedAccount(response.data);

            if (parseFloat(amount) > parseFloat(selectedAccount.balance)) {
                setError("Insufficient funds.");
                return;
            }

            const chequeData = {
                accountId: response.data.accountId,
                chequeNumber: "string", // This should be generated on the server side
                issueDate,
                payeeName,
                amount,
                status: "Issued"
            };

            const issueResponse = await axios.post(`http://localhost:5244/api/Account/Cheque?accountNumber=${selectedAccount.accountNumber}`, chequeData, {
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
                    <div className="mb-3">
                        <label htmlFor="accountNumber" className="form-label">Account Number</label>
                        <input type="text" className="form-control" id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
                    </div>
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
                    <button type="submit" >Issue Cheque</button>
                </form>
            </div>
        </div>
    );
}

export default ChequeForm;
