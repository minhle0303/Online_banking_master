import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-scroll';

const RequestForm = () => {
    const [serviceRequests, setServiceRequests] = useState([]);
    const [newRequestType, setNewRequestType] = useState('');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        const fetchServiceRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5244/api/ServiceRequest/typeRequest');
                setServiceRequests(response.data);
            } catch (error) {
                console.error('Error fetching the service requests', error);
            }
        };

        fetchServiceRequests();
    }, []);

    useEffect(() => {
        if (notification || error) {
            const timer = setTimeout(() => {
                setNotification('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification, error]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setNotification('');

        if (!newRequestType.trim()) {
            setError('Type Request cannot be empty');
            return;
        }

        const existingRequest = serviceRequests.find(request => 
            request.typerequest.toLowerCase() === newRequestType.toLowerCase()
        );
        if (existingRequest) {
            setError('Type Request already exists');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5244/api/ServiceRequest/typeRequest', {
                typerequest: newRequestType
            });

            if (response.status === 200 || response.status === 201) {
                setNotification('Request created successfully!');
                setNewRequestType('');
                const updatedRequests = await axios.get('http://localhost:5244/api/ServiceRequest/typeRequest');
                setServiceRequests(updatedRequests.data);
            } else {
                throw new Error(response.data.errorMessage || "Creation failed");
            }
        } catch (error) {
            console.error("Failed to create the request:", error);
            setError(error.response?.data?.message || "Failed to create the request due to a network error.");
        }
    };

    const handleDelete = async () => {
        if (deleteConfirm === null) return;

        try {
            await axios.delete(`http://localhost:5244/api/ServiceRequest/typeRequest/${deleteConfirm}`);
            setNotification('Request deleted successfully!');
            setServiceRequests(serviceRequests.filter(request => request.typeRequestId !== deleteConfirm));
        } catch (error) {
            console.error('Failed to delete the request:', error);
            setError('Failed to delete the request. Please try again.');
        } finally {
            setDeleteConfirm(null);
        }
    };

    return (
        <div className='request-service-main'>
            <h3>Request Service</h3><hr />
            <div className="request-service-row">
                <div className="request-service-form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="requestType" className="form-label">Request Type</label>
                        <input
                            type="text"
                            className="form-control"
                            id="requestType"
                            value={newRequestType}
                            onChange={(e) => setNewRequestType(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary mt-3">Create Request</button>
                        {error && <div className="request-service-alert request-service-alert-danger mt-3">{error}</div>}
                        {notification && <div className="request-service-alert request-service-alert-success mt-3">{notification}</div>}
                    </form>
                </div>
                <div className="request-service-table">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Type Request</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceRequests.map((request, index) => (
                                <tr key={request.typeRequestId}>
                                    <td>{index + 1}</td>
                                    <td>{request.typerequest}</td>
                                    <td>
                                        <button className='btn btn-danger' onClick={() => setDeleteConfirm(request.typeRequestId)}>X</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="request-service-modal" id="deleteModal" style={{display: 'block'}}>
                    <div className="request-service-modal-content">
                        <div className="request-service-modal-header">
                            <h4>Confirm Delete</h4>
                            <span className="request-service-close" onClick={() => setDeleteConfirm(null)}>&times;</span>
                        </div>
                        <div className="request-service-modal-body">
                            <p>Are you sure you want to delete this request?</p>
                        </div>
                        <div className="request-service-modal-footer">
                            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestForm;
