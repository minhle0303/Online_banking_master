import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListRequest() {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [requestsPerPage] = useState(10);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5244/api/ServiceRequest/serviceRequest');
            setServiceRequests(response.data);
        } catch (error) {
            console.error('Error fetching the service requests', error);
        }
    };

    const handleStatusChange = async (requestId) => {
        const confirmChange = window.confirm('Are you sure you want to mark this request as Completed?');
        if (!confirmChange) {
            return; // Hủy bỏ hành động nếu người dùng không xác nhận
        }

        try {
            const response = await axios.put(`http://localhost:5244/api/ServiceRequest/${requestId}/complete`);
            if (response.status === 200) {
                alert('Status updated to Completed.');
                fetchData(); // Fetch the updated list of service requests
            }
        } catch (error) {
            console.error('Error updating the status', error);
        }
    };

    const filteredRequests = serviceRequests.filter(request => 
        request.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredRequests.length / requestsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="main-content-user">
            <h3>Request Service List</h3><hr />
            <input
                type="text"
                placeholder="Search by name or status"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="transaction-history">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Request Date</th>
                            <th>Message</th>
                            <th>Type Request</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((request, index) => (
                            <tr key={request.requestId}>
                                <td>{indexOfFirstRequest + index + 1}</td>
                                <td>{request.user.firstName} {request.user.lastName}</td>
                                <td>{new Date(request.requestDate).toLocaleString()}</td>
                                <td>{request.content}</td>
                                <td>{request.typeRequest.typerequest}</td>
                                <td>
                                    {request.status === 'Pending' ? (
                                        <button onClick={() => handleStatusChange(request.requestId)}>Pending</button>
                                    ) : (
                                        'Completed'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
    );
}

export default ListRequest;
