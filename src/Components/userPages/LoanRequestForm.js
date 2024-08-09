import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoanRequestForm = () => {
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [termMonths, setTermMonths] = useState('');
    const [preview, setPreview] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [message, setMessage] = useState({ text: '', type: '' }); // 'success' or 'error'



    const userToken = JSON.parse(localStorage.getItem("tokenData"));

    const fetchAccounts = async () => {
        try {
            setLoading(true);
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
            setError('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);


    const handleSelectAccount = (account) => {
        setSelectedAccount(account);
        setShowAccountDropdown(false);
    };

    const calculateMonthlyPayment = (amount, rate, months) => {
        const monthlyRate = rate / 1200;
        const payment = (amount * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -months));
        return payment.toFixed(2);
    };

    const handlePreview = (e) => {
        e.preventDefault();
        if (!selectedAccount) {
            setMessage("Please select an account first.");
            return;
        }
        if (!loanAmount || !interestRate || !termMonths) {
            setMessage({ text: "All fields are required.", type: 'error' });
            return;
        }
    
        if (parseFloat(loanAmount) > selectedAccount.balance) {
            setMessage({ text: "Loan amount exceeds account balance.", type: 'error' });
            return;
        }
        const monthlyPayment = calculateMonthlyPayment(parseFloat(loanAmount), parseFloat(interestRate), parseInt(termMonths));
        const loanDetails = {
            accountId: selectedAccount.accountId,
            loanAmount: parseFloat(loanAmount),
            interestRate: parseFloat(interestRate),
            termMonths: parseInt(termMonths),
            monthlyPayment
        };
        setPreview(loanDetails);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loanAmount || !interestRate || !termMonths) {
            setMessage({ text: "All fields are required.", type: 'error' });
            return;
        }
    
        if (parseFloat(loanAmount) > selectedAccount.balance) {
            setMessage({ text: "Loan amount exceeds account balance.", type: 'error' });
            return;
        }

        try {
            const loan = {
                accountId: selectedAccount.accountId,
                loanAmount: parseFloat(loanAmount),
                interestRate: parseFloat(interestRate),
                termMonths: parseInt(termMonths),
            };

            const response = await axios.post('http://localhost:5244/api/Loan', loan);
            setMessage({ text: `Loan request successful! Loan ID: ${response.data.loanId}`, type: 'success' });
            setPreview(null); // Clear preview
            setLoanAmount(''); // Reset loan amount
            setInterestRate('7'); // Reset interest rate to default
            setTermMonths(''); // Reset term
            await fetchAccounts(); // Refresh accounts to update the list
        } catch (error) {
            setMessage({ text: `Error: ${error.response ? error.response.data : 'Server is not responding'}`, type: 'error' });
        }
    };

    return (
        <div className="loan-container">

            <div className="loan-request-form">
                <h3>Request a Loan</h3>
                {loading ? (
                    <p>Loading accounts...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                       {message.text && (
    <div style={{
        padding: '10px',
        marginBottom: '20px',
        borderRadius: '4px',
        color: 'white',
        backgroundColor: message.type === 'error' ? '#f44336' : '#4CAF50', // Red for error, green for success
        textAlign: 'center'
    }}>
        {message.text}
    </div>
)}
                        

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
                                                    <div key={account.accountId} onClick={() => handleSelectAccount(account)}>
                                                        {account.accountNumber} - {account.balance} USD
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <form onSubmit={handlePreview}>
                            <div>
                                <label>Loan Amount:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(e.target.value)}
                                    
                                />
                            </div>
                            <div>
                                <label>Interest Rate (% per year):</label>
                                <select value={interestRate} onChange={(e) => setInterestRate(e.target.value)}>
                                    <option value="">--Please choose an option--</option>
                                    <option value="7">7% - Mortgage Loan</option>
                                    <option value="8">8% - Personal Loan</option>
                                </select>
                                <p>Note: 7% for mortgage loans, 8% for personal loans.</p>
                            </div>
                            <div>
                                <label>Term (Months):</label>
                                <input
                                    type="number"
                                    value={termMonths}
                                    onChange={(e) => setTermMonths(e.target.value)}
                                    
                                />
                            </div>
                            <button type="submit">Preview</button>
                        </form>

                        {preview && (
                            <div className="preview">
                                <h3>Loan Preview</h3>
                                <p>Account ID: {preview.accountId}</p>
                                <p>Loan Amount: {preview.loanAmount}</p>
                                <p>Interest Rate: {preview.interestRate}%</p>
                                <p>Term: {preview.termMonths} months</p>
                                <p>Monthly Payment: ${preview.monthlyPayment}</p>
                                <button onClick={handleSubmit}>Submit Loan Request</button>
                            </div>
                        )}

                    </>
                )}
            </div>
            <div className="loan-list">
                <h3>Active Loans</h3>
                <div className="table-responsive">
                    {selectedAccount && selectedAccount.loans.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                <th>#</th>
                                    <th>Loan Amount (USD)</th>
                                    <th>Interest Rate (%)</th>
                                    <th>Term (Months)</th>
                                    <th>Monthly Payment (USD)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedAccount.loans.map((loan, index)=> (
                                    <tr key={loan.loanId}>
                                           <td>{index+1}</td>
                                        <td>{loan.loanAmount}</td>
                                        <td>{loan.interestRate}</td>
                                        <td>{loan.termMonths}</td>
                                        <td>{loan.monthlyPayment}</td>
                                        <td>{loan.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No active loans available.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default LoanRequestForm;