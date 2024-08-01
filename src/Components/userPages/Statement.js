import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Statement() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statementData, setStatementData] = useState([]);
    const [error, setError] = useState('');
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

    const handleCreateStatement = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setError('End date cannot be earlier than start date.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5244/api/Account/${selectedAccount}/statement`, {
                params: { startDate, endDate },
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            
            if (response.data.length === 0) {
                setError('No data available for the selected date range.');
                setStatementData([]); // Clear previous data if any
            } else {
                setStatementData(response.data);
                setError(''); // Clear any previous error
            }
        } catch (err) {
            setError('No data available for the selected date range. Please try again.');
            setStatementData([]);
        }
    };

    const handleSendEmail = async () => {
        const email = userToken.data.email; // Lấy email từ token

        if (!email) {
            setError('Email not found in token.');
            return;
        }

        if (statementData.length === 0) {
            setError('No statement data to send.');
            return;
        }

        const request = {
            AccountId: selectedAccount,
            StartDate: startDate,
            EndDate: endDate,
            Email: email,
            StatementData: statementData
        };

        try {
            const response = await axios.post('http://localhost:5244/api/email/send-statement', request, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            if (response.status === 200) {
                alert('Statement sent successfully.');
            } else {
                setError('Failed to send statement. Please try again.');
            }
        } catch (err) {
            console.error("Error sending statement:", err);
            setError('Failed to send statement. Please try again.');
        }
    };

    const handleBack = () => {
        navigate('/user/transaction');
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        setStatementData([]);
    };

    return (
        <div className='main-content-user'>
            <div className='main-content-user-statement'>
                <button onClick={handleBack} className='back-button'>Back</button>
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
                    {error && <div className='error-message'>{error}</div>}
                    <div className='button-group'>
                        <button onClick={handleCreateStatement} className='create-statement-button-statement'>Create</button>
                    
                        <button onClick={handleClear} className='clear-button'>Clear</button>
                    </div>
                </div>
            </div>
            {statementData.length > 0 ? (
                <div className='statement-results'>
                    <h3>Statement Results</h3>
                    <div className='button-container1'>
                        <button onClick={handleSendEmail} className='send-email-button'>Send to Email</button>
                    </div>
                   
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Sent</th>
                                <th>Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statementData.map((transfer, index) => (
                                <tr key={transfer.transferId} className={transfer.fromAccount?.accountId === selectedAccount || transfer.toAccount?.accountId === selectedAccount ? 'highlight' : ''}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(transfer.transferDate).toLocaleDateString()}</td>
                                    <td>{transfer.description}</td>
                                    <td>
                                        <span style={{ color: 'red' }}>-{transfer.amount}</span> <br />
                                        to: {transfer.toAccount?.user?.firstName} {transfer.toAccount?.user?.lastName} <br />
                                        {transfer.toAccount?.accountNumber}
                                    </td>
                                    <td>
                                        <span style={{ color: 'green' }}>+{transfer.amount}</span> <br />
                                        from: {transfer.fromAccount?.user?.firstName} {transfer.fromAccount?.user?.lastName} <br />
                                        {transfer.fromAccount?.accountNumber}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="3">Total</td>
                                <td>{statementData.reduce((acc, transfer) => acc + transfer.amount, 0)}</td>
                                <td>{statementData.reduce((acc, transfer) => acc + transfer.amount, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='no-data-message'>No data available for the selected date range.</div>
            )}
        </div>
    );
}

export default Statement;
