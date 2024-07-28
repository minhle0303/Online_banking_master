import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal } from 'react-bootstrap';

const ListCheque = () => {
    const [cheques, setCheques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCheque, setSelectedCheque] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [transfersPerPage] = useState(10);

    useEffect(() => {
        const fetchCheques = async () => {
            try {
                const response = await axios.get('http://localhost:5244/api/Account/Cheque');
                setCheques(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching cheques:', error);
                setIsLoading(false);
            }
        };

        fetchCheques();
    }, []);

    const handleShow = (cheque) => {
        setSelectedCheque(cheque);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const filteredCheques = cheques.filter(cheque => 
        cheque.payeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cheque.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastTransfer = currentPage * transfersPerPage;
    const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;
    const currentTransfers = filteredCheques.slice(indexOfFirstTransfer, indexOfLastTransfer);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCheques.length / transfersPerPage); i++) {
        pageNumbers.push(i);
    }

    if (isLoading) {
        return <p>Loading cheques...</p>;
    }

    return (
        <div className="main-content-user">
            <h3>Cheque List</h3><hr />
            <input
                type="text"
                placeholder="Search by name or status"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cheque Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCheque && (
                        <div>
                            <p><strong>Cheque Number:</strong> {selectedCheque.chequeNumber}</p>
                            <p><strong>Issue Date:</strong> {new Date(selectedCheque.issueDate).toLocaleString()}</p>
                            <p><strong>Payee Name:</strong> {selectedCheque.payeeName}</p>
                            <p><strong>Amount:</strong> ${selectedCheque.amount}</p>
                            <p><strong>Status:</strong> {selectedCheque.status}</p>
                            <p><strong>Account Number:</strong> {selectedCheque.account.accountNumber}</p>
                            <p><strong>Balance:</strong> ${selectedCheque.account.balance}</p>
                            <p><strong>Account Holder:</strong> {selectedCheque.account.user.firstName} {selectedCheque.account.user.lastName}</p>
                            <p><strong>Email:</strong> {selectedCheque.account.user.email}</p>
                            <p><strong>Address:</strong> {selectedCheque.account.user.address}</p>
                            <p><strong>Phone:</strong> {selectedCheque.account.user.phone}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="transaction-history">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Cheque Number</th>
                            <th>Issue Date</th>
                            <th>Payee Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransfers.map((cheque, index) => (
                            <tr key={index} onClick={() => handleShow(cheque)}>
                                <td>{indexOfFirstTransfer + index + 1}</td>
                                <td>{cheque.chequeNumber}</td>
                                <td>{new Date(cheque.issueDate).toLocaleString()}</td>
                                <td>{cheque.payeeName}</td>
                                <td>${cheque.amount}</td>
                                <td>{cheque.status}</td>
                                <td className='button-container'>
                                    <Button className="button-list" onClick={() => handleShow(cheque)}>X</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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

export default ListCheque;
