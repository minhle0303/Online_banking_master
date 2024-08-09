import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ServiceRequest() {
    const location = useLocation();
    const initialContent = location.state?.chequeNumber ? `chequenumber: ${location.state.chequeNumber}` : "";
    const [request, setRequest] = useState({ 
        userId: "", 
        typeRequestId: "",
        requestDate: "",
        content: initialContent
    });
    const [typeRq, setTypeRq] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));

    const fetchTypeRq = async () => {
        try {
            const response = await axios.get(`http://localhost:5244/api/ServiceRequest/typeRequest`);
            setTypeRq(response.data);
        } catch (err) {
            console.error("Error fetching types of requests:", err);
        }
    };

    const fetchServiceRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
                headers: { 'Authorization': `Bearer ${userToken.token}` }
            });
            setServiceRequests(response.data.serviceRequests);
        } catch (err) {
            console.error("Error fetching service requests:", err);
        }
    };

    useEffect(() => {
        fetchTypeRq();
        fetchServiceRequests();
    }, [userToken]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullRequest = {
            ...request,
            userId: userToken.data.userId,
            requestDate: new Date().toISOString()
        };

        try {
            await axios.post("http://localhost:5244/api/ServiceRequest/serviceRequest", fullRequest);
            alert('Request sent successfully!');
            setRequest({ ...request, content: "" }); // Clear the content after submission
            fetchServiceRequests(); // Re-fetch the service requests to update the list
        } catch (err) {
            console.error("Failed to send request:", err);
        }
    };
    return (
        <div className='main-content-user'>
            <div className="service-container">
                <h3>Service Request</h3>
                <hr />
                <div className="service-form-and-list">
                    <div className="service-form">
                        <form className="issue-form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="typeRq" className="form-label">Request Type:</label>
                                <select className="select-form-control" name="typeRequestId" value={request.typeRequestId} onChange={handleChangeInput}>
                                    <option value="">--Please choose an option--</option>
                                    {typeRq.map((item, index) => (
                                        <option key={index} value={item.typeRequestId}>{item.typerequest}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Content:</label>
                                <textarea name="content" className="textarea" value={request.content} onChange={handleChangeInput} placeholder="Enter request content"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Request Service</button>
                        </form>
                    </div>
                   
                </div>
                
            </div>
            <div className="transaction-history">
                        <h4>Existing Requests</h4>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Type of Request</th>
                                    <th>Content</th>
                                    <th>Request Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceRequests.map((req, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{req.typeRequest?.typerequest}</td>
                                        <td>{req.content}</td>
                                        <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                                        <td>{req.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
        </div>
    );
}

export default ServiceRequest;
