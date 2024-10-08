import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OpenAccount() {
    const [accountNumber, setAccountNumber] = useState('');
    const [balance, setBalance] = useState(0);  // Initialize balance to 0
    const [typeAccountId, setTypeAccountId] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [accountTypes, setAccountTypes] = useState([]);
    const [showPinInput, setShowPinInput] = useState(false);
    const navigate = useNavigate();
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));

    useEffect(() => {
        fetchAccountTypes();
        generateAccountNumber(12);  // Initially generate a 12-digit account number
    }, []);  // Dependencies array is empty, meaning this effect runs once after the initial render

    async function fetchAccountTypes() {
        try {
            const { data } = await axios.get('http://localhost:5244/api/Account/TypeAccount', {
                headers: { 'Authorization': `Bearer ${userToken.token}` }
            });
            setAccountTypes(data);
        } catch (error) {
            console.error("Error fetching account types:", error);
            setError("Failed to fetch account types");
        }
    }

    const generateAccountNumber = (length) => {
        let result = '';
        const characters = '0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setAccountNumber(result);
    };

    const handleNext = async () => {
        // Check if the required fields are filled
        if (!accountNumber || !typeAccountId) {  // No need to check balance as it's always 0
            setError('Please fill all fields before proceeding.');
            return;
        }

        // Validate account number length
        if (accountNumber.length !== 12) {
            setError('Account number must be exactly 12 digits.');
            return;
        }

        try {
            // Fetch user data from the API
            const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });

            // Check if the response contains account data
            if (!response || !response.data || !response.data.accounts) {
                setError('User account data is not available.');
                return;
            }

            // Check if the user already has an account of the selected type
            const existingAccount = response.data.accounts.find(account => account.typeAccountId === parseInt(typeAccountId));

            if (existingAccount) {
                setError('You already have an account of this type.');
                return;
            }

            // Proceed to show PIN input
            setShowPinInput(true);
            setError('');

        } catch (error) {
            setError('Failed to fetch user data: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pin) {
            setError('Please enter your PIN.');
            return;
        }

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
            setError('');
            navigate('/user/home');  // Navigate to home on success
        } catch (error) {
            setError("Failed to create account: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='main-content-user'>
            <div className="transfer-container">
                <h3>Open New Account</h3>
                <hr />
                {error && <div className="alert alert-danger">{error}</div>}
                <form className="issue-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="accountNumber">Account Number:</label>
                        <input
                            type="text"
                            className="select-form-control"
                            value={accountNumber}
                            onChange={e => setAccountNumber(e.target.value)}
                            maxLength={12}  // Restrict input to 12 characters
                        />
                        <button type="button" onClick={() => generateAccountNumber(12)}>Generate New</button>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="balance">Balance:</label>
                        <input
                            type="number"
                            className="select-form-control"
                            value={balance}
                            readOnly  // Set the balance input as read-only
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="typeAccountId">Account Type:</label>
                        <select className="form-control" id="typeAccountId" value={typeAccountId} onChange={e => setTypeAccountId(e.target.value)} required>
                            <option value="">--Please choose an option--</option>
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
