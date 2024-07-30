import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Statement() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + userToken.token
                    }
                });
                setAccounts(response.data.accounts);
                if (response.data.accounts.length > 0) {
                    setSelectedAccount(response.data.accounts[0].accountId);
                }
            } catch (err) {
                console.error("Error fetching accounts:", err);
            }
        };

        fetchAccounts();
    }, [userToken]);

    const handleCreateStatement = () => {
        if (selectedAccount && startDate && endDate) {
            navigate(`/statement?accountId=${selectedAccount}&startDate=${startDate}&endDate=${endDate}`);
        }
    };

    return (
        <div className='main-content-user-statement'>
            <h3>Create Statement</h3>
            <hr />
            <div className='statement-form-statement'>
                <div className='form-group-statement'>
                    <label htmlFor='accountSelect-statement'>Select Account:</label>
                    <select
                        id='accountSelect-statement'
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                        {accounts.map(account => (
                            <option key={account.accountId} value={account.accountId}>
                                Account Number: {account.accountNumber} - Balance: {account.balance}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='form-group-statement'>
                    <label htmlFor='startDate-statement'>Start Date:</label>
                    <input
                        type='date'
                        id='startDate-statement'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className='form-group-statement'>
                    <label htmlFor='endDate-statement'>End Date:</label>
                    <input
                        type='date'
                        id='endDate-statement'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button onClick={handleCreateStatement} className='create-statement-button-statement'>Create Statement</button>
            </div>
        </div>
    );
}

export default Statement;
