import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const TransactionHistory = ({ accountId }) => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]); // Lưu trữ danh sách accounts
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 10;
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();


    async function refreshToken() {
        try {
            const response = await axios.post("http://localhost:5244/api/Auth/refresh-token", {
                refreshToken: userToken?.refreshToken
            });
            localStorage.setItem("tokenData", JSON.stringify(response.data));
            setUserToken(response.data);
            return response.data.token;
        } catch (error) {
            console.error("Error refreshing token:", error);
            throw new Error("Failed to refresh token");
        }
    }

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

    useEffect(() => {
        if (selectedAccount) {
            const fetchTransactions = async () => {
                try {
                    console.log("select:", selectedAccount);
                    const receivedTransfers = await axios.get(`http://localhost:5244/api/Account/receivedTransfers/${selectedAccount}`);
                    const sentTransfers = await axios.get(`http://localhost:5244/api/Account/sentTransfers/${selectedAccount}`);

                    const formattedReceived = receivedTransfers.data.map(tx => ({ ...tx, type: 'received' }));
                    const formattedSent = sentTransfers.data.map(tx => ({ ...tx, type: 'sent' }));

                    const allTransactions = [...formattedReceived, ...formattedSent].sort((a, b) => new Date(b.transferDate) - new Date(a.transferDate));
                    setTransactions(allTransactions);
                    console.log("trans", transactions);
                } catch (error) {
                    console.error('Error fetching transactions:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchTransactions();
        }
    }, [selectedAccount]);

    const filteredTransactions = transactions.filter(tx => {
        return (
            tx.toAccount?.user?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.toAccount?.user?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            new Date(tx.transferDate).toLocaleDateString().includes(searchQuery)
        );
    });

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredTransactions.length / transactionsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const TransactionDetails = ({ transaction, onClose }) => {
        if (!transaction) return null;

        return (
            <div className="transaction-details">
                <button onClick={onClose} className="close-button">X</button>
                <h4>Transaction Details</h4>
                <p><strong>Sender Account Name:</strong> {transaction.senderName}</p>
                <p><strong>Sender Account Number:</strong> {transaction.senderAccount}</p>
                <p><strong>Recipient Account Name:</strong> {transaction.recipientName}</p>
                <p><strong>Recipient Account Number:</strong> {transaction.recipientAccount}</p>
                <p><strong>Date:</strong> {new Date(transaction.transferDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {transaction.description}</p>
                <p><strong>Amount:</strong> {transaction.type === 'received' ? `+${transaction.amount} USD` : `-${transaction.amount} USD`}</p>
            </div>
        );
    };

    const handleTransactionClick = async (transaction) => {
        console.log("tran", transaction);
        try {
            const senderResponse = await axios.get(`http://localhost:5244/api/Account/${transaction.fromAccountId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            const senderDetails = senderResponse.data;

            const recipientResponse = await axios.get(`http://localhost:5244/api/Account/${transaction.toAccountId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            const recipientDetails = recipientResponse.data;

            const detailedTransaction = {
                ...transaction,
                senderName: `${senderDetails.user.lastName} ${senderDetails.user.firstName}`,
                senderAccount: `${senderDetails.accountNumber}`,
                recipientName: `${recipientDetails.user.lastName} ${recipientDetails.user.firstName}`,
                recipientAccount: `${recipientDetails.accountNumber}`
            };

            // Set the updated transaction details
            setSelectedTransaction(detailedTransaction);
        } catch (error) {
            console.error('Error fetching account details:', error);
            setSelectedTransaction(transaction); // Set without modification if error occurs
        }
    };

    const handleCloseDetails = () => {
        setSelectedTransaction(null);
    };
    const handleStatementClick = () => {
            navigate('statement');
    };

    return (
        <div className="main-content-user">
            <h3>Transaction History</h3><hr />

            <div className="accounts-list">
                <h2>Choose an Account</h2> <br />
                <select
                    value={selectedAccount || ''}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="account-select-tran"
                >
                    <option value="">Select an Account</option>
                    {accounts.map(account => (
                        <option key={account.accountId} value={account.accountId}>
                            Account Number: {account.accountNumber} - Balance: {account.balance}
                        </option>
                    ))}
                </select>
                <button onClick={handleStatementClick} className="statement-button">Create Statement</button>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by recipient or date"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="transaction-history">
                {selectedTransaction && <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
                {transactions.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Sender Name</th>
                                    <th>Message</th>
                                    <th>Recipient</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransactions.map(tx => (
                                    <tr key={tx.transferId} onClick={() => handleTransactionClick(tx)}>
                                        <td>{`${new Date(tx.transferDate).toLocaleDateString()} - ${new Date(tx.transferDate).toLocaleTimeString()}`}</td>
                                        <td>{tx.fromAccount?.user?.firstName} {tx.fromAccount?.user?.lastName }</td>
                                        <td>{tx.description}</td>
                                        <td>{tx.toAccount?.user?.firstName} {tx.toAccount?.user?.lastName}  </td>
                                        <td className={tx.type === 'received' ? 'amount received' : 'amount sent'}>
                                            {tx.type === 'received' ? `+${tx.amount} USD` : `-${tx.amount} USD`}
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                        </table>
                        <div className="pagination">
                            {pageNumbers.map(number => (
                                <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''}>
                                    {number}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    selectedAccount && <div>No transactions found for this account.</div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
