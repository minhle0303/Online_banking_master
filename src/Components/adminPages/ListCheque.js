import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const ListCheque = () => {
    const [cheques, setCheques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCheque, setSelectedCheque] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [transfersPerPage] = useState(10);
    const [payeeName, setPayeeName] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

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
        console.log("seletc",selectedCheque);
        setPayeeName(cheque.payeeName);
        setIssueDate(new Date(cheque.issueDate).toISOString().substring(0, 10));
        setStatus(cheque.status);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleUpdate = async () => {
        try {
            const updatedCheque = {
                ...selectedCheque,
                payeeName,
                issueDate,
                status
            };
            await axios.put(`http://localhost:5244/api/Account/${selectedCheque.chequeId}/cheque`, updatedCheque, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCheques(cheques.map(cheque => cheque.chequeId === updatedCheque.chequeId ? updatedCheque : cheque));
            setMessage('Cheque updated successfully.');
            setMessageType('success');
            setShowModal(false);
        } catch (error) {
            console.error('Error updating cheque:', error);
            setMessage('Failed to update cheque.');
            setMessageType('error');
        }
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
             {message && <div style={{ color: messageType === 'error' ? 'red' : 'green' }}>{message}</div>}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Cheque Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCheque && (
                        <Form>
                            <Form.Group controlId="formChequeNumber">
                                <Form.Label>Cheque Number</Form.Label>
                                <Form.Control type="text" value={selectedCheque.chequeNumber} readOnly />
                            </Form.Group>
                            <Form.Group controlId="formIssueDate">
                                <Form.Label>Issue Date</Form.Label>
                                <Form.Control type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formPayeeName">
                                <Form.Label>Payee Name</Form.Label>
                                <Form.Control type="text" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Issued">Issued</option>
                                    <option value="Stop">Stop</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
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
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransfers.map((cheque, index) => (
                            <tr key={index}>
                                <td>{indexOfFirstTransfer + index + 1}</td>
                                <td>{cheque.chequeNumber}</td>
                                <td>{new Date(cheque.issueDate).toLocaleString()}</td>
                                <td>{cheque.payeeName}</td>
                                <td>${cheque.amount}</td>
                                <td>{cheque.status}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleShow(cheque)}>Details</Button>
                                </td>
                                <td>
                                    <Button variant="warning" onClick={() => handleShow(cheque)}>Update</Button>
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
