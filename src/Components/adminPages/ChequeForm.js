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

    const handleAccountCheck = async () => {
        setError('');
        setNotification('');

        try {
            const response = await axios.get(`http://localhost:5244/api/Account/GetAccountByAccNo/${accountNumber}`, {
                headers: { 'Authorization': `Bearer ${userToken.token}` }
            });
            setSelectedAccount(response.data);
            setNotification('Account found.');
        } catch (error) {
            console.error("Failed to fetch the account:", error);
            setError('Account not found.');
            setSelectedAccount(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setNotification('');

        if (!selectedAccount) {
            setError('Please enter a valid account number.');
            return;
        }
        if (!payeeName&&!amount) {
            setError('Please enter all value');
            return;
        }

        try {
            if (parseFloat(amount) > parseFloat(selectedAccount.balance)) {
                setError("Insufficient funds.");
                return;
            }

            const chequeData = {
                accountId: selectedAccount.accountId,
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
                <form className="issue-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="accountNumber" className="form-label">Account Number</label>
                        <input type="text" className="form-control" id="accountNumber" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                        <button type="button" onClick={handleAccountCheck}>Check Account</button>
                    </div>
                    {selectedAccount && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Account Holder Name</label>
                                <input type="text" className="form-control" value={`${selectedAccount.user.firstName} ${selectedAccount.user.lastName}`} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Current Balance</label>
                                <input type="text" className="form-control" value={selectedAccount.balance} readOnly />
                            </div>
                        </>
                    )}
                    <div className="mb-3">
                        <label htmlFor="issueDate" className="form-label">Issue Date</label>
                        <input type="date" className="form-control" id="issueDate" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="payeeName" className="form-label">Payee Name</label>
                        <input type="text" className="form-control" id="payeeName" value={payeeName} onChange={e => setPayeeName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">Amount</label>
                        <input type="number" className="form-control" id="amount" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                    <button type="submit">Issue Cheque</button>
                </form>
            </div>
        </div>
    );
}

export default ChequeForm;

