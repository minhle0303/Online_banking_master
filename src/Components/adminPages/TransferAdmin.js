import axios from 'axios';
import React, { useEffect, useState } from 'react';

function TransferAdmin(props) {
    const [transfers, setTransfers] = useState([]);
    const [accounts, setAccounts] = useState({});
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [transfersPerPage] = useState(10);

    useEffect(() => {
        const fetchTransfers = async () => {
            try {
                const response = await axios.get('http://localhost:5244/api/Account/transfer', {
                    headers: {
                        'Authorization': 'Bearer ' + userToken?.token
                    }
                });
                const transfersData = response.data;

                const fetchAccountDetails = async (accountId) => {
                    const response = await axios.get(`http://localhost:5244/api/Account/${accountId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + userToken?.token
                        }
                    });
                    return response.data;
                };

                const accountIds = new Set();
                transfersData.forEach(transfer => {
                    accountIds.add(transfer.fromAccountId);
                    accountIds.add(transfer.toAccountId);
                });
                const accountPromises = Array.from(accountIds).map(id =>
                    fetchAccountDetails(id)
                );
                const accountResponses = await Promise.all(accountPromises);
                const accountsData = {};
                accountResponses.forEach(response => {
                    accountsData[response.accountId] = response;
                });

                const updatedTransfers = transfersData.map(transfer => ({
                    ...transfer,
                    senderAccount: accountsData[transfer.fromAccountId]?.accountNumber || '',
                    recipientAccount: accountsData[transfer.toAccountId]?.accountNumber || '',
                }));

                setTransfers(updatedTransfers);
                setAccounts(accountsData);
            } catch (error) {
                console.error('Error fetching transfers or accounts', error);
            }
        };

        fetchTransfers();
    }, [userToken]);

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
                <p><strong>Amount:</strong> {transaction.amount} USD</p>
            </div>
        );
    };

    const handleTransactionClick = async (transfer) => {
        try {
            const senderResponse = await axios.get(`http://localhost:5244/api/Account/${transfer.fromAccountId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            const senderDetails = senderResponse.data;

            const recipientResponse = await axios.get(`http://localhost:5244/api/Account/${transfer.toAccountId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            const recipientDetails = recipientResponse.data;

            const detailedTransaction = {
                ...transfer,
                senderName: `${senderDetails.user.lastName} ${senderDetails.user.firstName}`,
                senderAccount: `${senderDetails.accountNumber}`,
                recipientName: `${recipientDetails.user.lastName} ${recipientDetails.user.firstName}`,
                recipientAccount: `${recipientDetails.accountNumber}`
            };

            setSelectedTransaction(detailedTransaction);
        } catch (error) {
            console.error('Error fetching account details:', error);
        }
    };

    const handleCloseDetails = () => {
        setSelectedTransaction(null);
    };

    const filteredTransfers = transfers.filter(transfer => {
        const senderAccount = accounts[transfer.fromAccountId]?.accountNumber || '';
        const recipientAccount = accounts[transfer.toAccountId]?.accountNumber || '';
        
        return (
            senderAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipientAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
            new Date(transfer.transferDate).toLocaleDateString().includes(searchQuery)
        );
    });

    const indexOfLastTransfer = currentPage * transfersPerPage;
    const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;
    const currentTransfers = filteredTransfers.slice(indexOfFirstTransfer, indexOfLastTransfer);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredTransfers.length / transfersPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="main-content-user">
            <h3>Transaction List</h3><hr />
            <input
                type="text"
                placeholder="Search by account number or date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {selectedTransaction && <TransactionDetails transaction={selectedTransaction} onClose={handleCloseDetails} />}
            <br />
            <div className="transaction-history">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>From Account</th>
                            <th>To Account</th>
                            <th>Transfer Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransfers.map((transfer, index) => (
                            <tr key={transfer.transferId} onClick={() => handleTransactionClick(transfer)}>
                                <td>{indexOfFirstTransfer + index + 1}</td>
                                <td>{transfer.senderAccount}</td>
                                <td>{transfer.recipientAccount}</td>
                                <td>{new Date(transfer.transferDate).toLocaleString()}</td>
                                <td>{transfer.amount}</td>
                                <td>{transfer.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={currentPage === number ? 'active' : ''}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TransferAdmin;

