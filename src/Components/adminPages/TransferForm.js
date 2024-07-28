import React, { useState } from 'react';
import axios from 'axios';

function TransferForm() {
    const [senderAccount, setSenderAccount] = useState('');
    const [recipientAccount, setRecipientAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [senderName, setSenderName] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [senderBalance, setSenderBalance] = useState(0);
    const [senderPin, setSenderPin] = useState('');

    const fetchAccountDetails = async (accountNumber, setName, setBalance = null, setPin = null) => {
        try {
            const response = await axios.get(`http://localhost:5244/api/Account/GetAccountByAccNo/${accountNumber}`);
            setName(`${response.data.user.firstName} ${response.data.user.lastName}`);
            if (setBalance) {
                setBalance(response.data.balance);
            }
            if (setPin) {
                setPin(response.data.user.pin);
            }
        } catch (err) {
            console.error('Error fetching account details:', err);
            setName('');
            setError('Failed to fetch account details. Please check the account number and try again.');
        }
    };

    const handleAccountNumberChange = (accountNumber, isSender) => {
        if (isSender) {
            setSenderAccount(accountNumber);
            fetchAccountDetails(accountNumber, setSenderName, setSenderBalance, setSenderPin);
        } else {
            setRecipientAccount(accountNumber);
            fetchAccountDetails(accountNumber, setRecipientName);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setNotification('');

        // Validation
        if (!description) {
            setError('Description is required.');
            setLoading(false);
            return;
        }
        if (senderAccount === recipientAccount) {
            setError('Sender and recipient accounts must be different.');
            setLoading(false);
            return;
        }
        if (parseFloat(amount) > senderBalance) {
            setError('Insufficient funds in the sender account.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5244/api/Account/transfer', {
                fromAccountNumber: senderAccount,
                toAccountNumber: recipientAccount,
                amount: parseFloat(amount),
                pin: senderPin, // Use the fetched PIN for the sender account
                description: description
            }, {
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("tokenData")).token
                }
            });
            setNotification('Transfer successful!');
            // Reset form fields if needed
            setSenderAccount('');
            setRecipientAccount('');
            setAmount('');
            setDescription('');
            setSenderName('');
            setRecipientName('');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to perform the transfer. Please try again.');
            }
        }
        setLoading(false);
    };

    return (
        <div className='main-content-user'>
            <div className="transfer-container">
                <h3>Transfer In OnlineBanking</h3>
                {error && <div className="error">{error}</div>}
                {notification && <div className="notification">{notification}</div>}
                <form className="transfer-form" onSubmit={handleSubmit}>
                    <label htmlFor="">From Account</label>
                    <input type="text" placeholder="From account number" value={senderAccount} onChange={(e) => handleAccountNumberChange(e.target.value, true)} required />
                    {senderName && <input type="text" placeholder="From account name" value={senderName} readOnly />}
                    
                    <label htmlFor="">To Account</label>
                    <input type="text" placeholder="To account number" value={recipientAccount} onChange={(e) => handleAccountNumberChange(e.target.value, false)} required />
                    {recipientName && <input type="text" placeholder="To account name" value={recipientName} readOnly />}
                    
                    <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    <div className="quick-amounts">
                        {[50, 100, 200, 300, 400, 500, 1000, 2000].map((amt) => (
                            <button key={amt} type="button" onClick={() => setAmount(amt.toString())}>{amt}</button>
                        ))}
                    </div>
                    
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    
                    <button type="submit" className="submit-btn" disabled={loading}>Transfer</button>
                </form>
            </div>
        </div>
    );
}

export default TransferForm;
