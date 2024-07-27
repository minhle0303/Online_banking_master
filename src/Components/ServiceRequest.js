import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ServiceRequest(props) {
    const [request, setRequest] = useState({ 
        userId: "8002", 
        typeRequestId: "",
        requestDate: "",
        content: ""
    });
    const [typeRq, setTypeRq] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [userToken, setUserToken] = useState(JSON.parse(localStorage.getItem("tokenData")));
    
    async function refreshToken() {
        try {
            const response = await axios.post("http://localhost:5244/api/Auth/refresh-token", {
                refreshToken: userToken.refreshToken
            });
            localStorage.setItem("tokenData", JSON.stringify(response.data));
            setUserToken(response.data);
            return response.data.token; // Return new token
        } catch (error) {
            console.error("Error refreshing token:", error);
            // setError('Failed to refresh token');
        }
    }

    async function fetchAccounts() {
        try {
            const response = await axios.get(`http://localhost:5244/api/User/${userToken.data.userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + userToken.token
                }
            });
            setAccounts(response.data.accounts);
            if (response.data.accounts.length > 0) {
                setSelectedAccount(response.data.accounts[0]);
            }
        } catch (err) {
            console.error("Error fetching accounts:", err);
            if (err.response?.status === 401) {
                const newToken = await refreshToken();
                if (newToken) {
                    fetchAccounts(); // Retry fetch accounts after refreshing token
                }
            } else {
                // setError('Failed to fetch account data');
            }
        }
    }

    async function fetchTypeRq() {
        try {
            const response = await axios.get(`http://localhost:5244/api/ServiceRequest/typeRequest`);
            setTypeRq(response.data);
            // console.log('type request', );
        } catch (err) {
            console.error("Error fetching accounts:", err);
        }
    }

    useEffect(() => {
        fetchAccounts();
        fetchTypeRq();
    }, [userToken]);

    function handleChangeInput(e){
        let {name,value} = e.target;
        setRequest({...request,[name]:value});
    }
    // console.log('request object to send on change inputs', request);

    const handleSubmit = async (e) => {
        e.preventDefault();

        request.userId = selectedAccount.accountId;
        request.requestDate = new Date();

        console.log('request object to send', request);
        await axios.post("http://localhost:5244/api/ServiceRequest/serviceRequest", request)
            .then(res=>{
                alert('sent request successfully');
            })
            .catch(err=>console.log(err))
    };

    return (
        <div className='main-content-user'>
            <div className="transfer-container">
                <h3>Service Request</h3>
                <hr />
            
                <form className="isssue-form" onSubmit={handleSubmit}>
                    <div className="mb-3 mt-3">
                        <label htmlFor="typeRq" className="form-label">Request Type:</label>
                        <select className="form-select" name='typeRequestId' onChange={handleChangeInput}>
                            <option value="">--Please choose an option--</option>
                            {typeRq.map((item, index) => {
                                return (<option key={index} value={item.typeRequestId}>{item.typerequest}</option>)
                            })}
                        </select>
                    </div>

                    <div className="mb-3 mt-3">
                        <label htmlFor="firstName" className="form-label">Content:</label>
                        <input type="text" className="form-control"
                            onChange={handleChangeInput} value={request.content}
                            placeholder="Enter request content" name="content" />
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Request Service</button>
                </form>
            
            </div>
        </div>
    );
}

export default ServiceRequest;

