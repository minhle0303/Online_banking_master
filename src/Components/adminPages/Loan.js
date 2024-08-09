import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loansPerPage] = useState(10); // Set the number of loans per page
    const [selectedLoan, setSelectedLoan] = useState(null);

    const fetchLoans = () => {
        // Fetch the list of loans
        axios.get('http://localhost:5244/api/Loan')
            .then(response => {
                setLoans(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the loans!', error);
            });
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleLoanClick = (loan) => {
        setSelectedLoan(loan);
    };

    const handleCloseDetails = () => {
        setSelectedLoan(null);
    };

    const handleActivateLoan = async (loanId) => {
        try {
            const response = await axios.put(`http://localhost:5244/api/Loan/${loanId}/execute`);
            if (response.status === 200) {
                alert('Loan activated successfully!');
                fetchLoans(); // Reload the loan data after successful activation
            }
        } catch (error) {
            console.error('There was an error activating the loan:', error);
            alert('Failed to activate the loan.');
        }
    };

    const LoanDetails = ({ loan, onClose }) => {
        return (
            <div className="loan-details">
                <h4>Loan Details</h4>
                <p><strong>Account Number:</strong> {loan.account.accountNumber}</p>
                <p><strong>Loan Amount:</strong> {loan.loanAmount}</p>
                <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                <p><strong>Loan Date:</strong> {new Date(loan.loanDate).toLocaleDateString()}</p>
                <p><strong>Term (Months):</strong> {loan.termMonths}</p>
                <p><strong>Status:</strong> {loan.status}</p>
                <button onClick={onClose}>Close</button>
            </div>
        );
    };

    // Filter loans based on search query
    const filteredLoans = loans.filter(loan =>
        loan.account.accountNumber.includes(searchQuery) ||
        new Date(loan.loanDate).toLocaleDateString().includes(searchQuery)
    );

    // Pagination logic
    const indexOfLastLoan = currentPage * loansPerPage;
    const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
    const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredLoans.length / loansPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="main-content-user">
            <h3>Loan List</h3><hr />
            <input
                type="text"
                placeholder="Search by account number or date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {selectedLoan && <LoanDetails loan={selectedLoan} onClose={handleCloseDetails} />}
            <br />
            
            <div className="transaction-history">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Account Number</th>
                            <th>Loan Amount</th>
                            <th>Interest Rate</th>
                            <th>Loan Date</th>
                            <th>Term (Months)</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLoans.map((loan, index) => (
                            <tr key={loan.loanId} onClick={() => handleLoanClick(loan)}>
                                <td>{indexOfFirstLoan + index + 1}</td>
                                <td>{loan.account.accountNumber}</td>
                                <td>{loan.loanAmount}</td>
                                <td>{loan.interestRate}%</td>
                                <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                                <td>{loan.termMonths}</td>
                                <td>{loan.status}</td>
                                <td>
                                    {loan.status === 'Pending' && (
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering the row click event
                                            handleActivateLoan(loan.loanId);
                                        }}>
                                            Activate Loan
                                        </button>
                                    )}
                                </td>
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
};

export default LoanList;
