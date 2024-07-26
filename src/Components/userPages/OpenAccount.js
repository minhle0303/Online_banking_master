import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OpenAccount() {
    const [accountNumber, setAccountNumber] = useState('');
    const [balance, setBalance] = useState('');
    const [typeAccountId, setTypeAccountId] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [accountTypes, setAccountTypes] = useState([]);
    const [showPinInput, setShowPinInput] = useState(false);
    const navigate = useNavigate();

    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
    const [allAccounts, setAllAccounts] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5244/api/Account', {
                    headers: { 'Authorization': `Bearer ${userToken.token}` }
                });
                setAllAccounts(data.map(account => account.accountNumber));
            } catch (error) {
                console.error("Error fetching accounts:", error);
                setError("Failed to fetch accounts for validation.");
            }
        };
        fetchAccounts();

        const fetchAccountTypes = async () => {
            try {
                const { data } = await axios.get('http://localhost:5244/api/Account/TypeAccount', {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                setAccountTypes(data);
            } catch (error) {
                console.error("Error fetching account types:", error);
                setError("Failed to fetch account types");
            }
        };
        fetchAccountTypes();
    }, [userToken.token]);

    const handleAmountChange = (length) => {
        let newAccountNumber = generateAccountNumber(length);
        while (allAccounts.includes(newAccountNumber)) {
            newAccountNumber = generateAccountNumber(length);
        }
        setAccountNumber(newAccountNumber);
    };

    const generateAccountNumber = (length) => {
        const digits = '0123456789';
        let account = '';
        for (let i = 0; i < length; i++) {
            account += digits[Math.floor(Math.random() * 10)];
        }
        return account;
    };

    const handleNext = () => {
        if (!accountNumber || !balance ) {
            setError("Please fill all fields before proceeding.");
            return;
        }
        if (allAccounts.includes(accountNumber)) {
            setError("Account number already exists. Please generate a new one.");
            return;
        }
        setShowPinInput(true);  // Show PIN input and submit button
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5244/api/Account', {
                userId: userToken.data.userId,
                accountNumber,
                balance,
                typeAccountId,
                pin
            }, {
                headers: { 'Authorization': `Bearer ${userToken.token}` }
            });
            console.log('Account created:', response.data);
            setError('');
            navigate('/user/home');  // Navigate to success page or similar
        } catch (error) {
            setError("Failed to create account: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="main-content-user">
            <div className="transfer-container">
                <h3>Open New Account</h3>
                <hr />
                {error && <div className="alert alert-danger">{error}</div>}
                <form className="isssue-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="accountNumber">Account Number:</label>
                        <input type="text" className="select-form-control" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} required />
                        <div className="quick-amounts">
                            {[12, 13, 14, 15, 16].map(length => (
                                <button key={length} type="button" onClick={() => handleAmountChange(length)}>
                                    Generate {length} digits
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="balance">Balance:</label>
                        <input type="number" className="select-form-control" value={balance} onChange={e => setBalance(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="typeAccountId">Account Type:</label>
                        <select className="select-form-control" id="typeAccountId" value={typeAccountId} onChange={e => setTypeAccountId(e.target.value)} required>
                            {accountTypes.map(type => (
                                <option key={type.typeAccountId} value={type.typeAccountId}>
                                    {type.type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {showPinInput && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="pin">PIN:</label>
                                <input type="password" className="select-form-control" value={pin} onChange={e => setPin(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary">Create Account</button>
                        </>
                    )}
                    {!showPinInput && (
                        <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default OpenAccount;
