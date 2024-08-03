import { useEffect, useState } from 'react';
// import './App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import FormAddAccount from './FormAddAccount';
import FormEditAccount from './FormEditAccount';

function AccountCRUD() {
    // For edit modal pop-up START
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // For edit modal pop-up END

    // Pagination START
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10); // số dòng muốn hiện trong 1 page
    // Pagination END

    const [accounts, setAccounts] = useState([]);
    // danh sách type account
    const [accTypes, setAccTypes] = useState([]);
    const [accountEdit, setAccountEdit] = useState({});

    const inputs = [
      {
        id: 1,
        name: "userId",
        type: "number",
        placeholder: "user id",
        errorMessage:
        "First name should be 2-15 characters and shouldn't include any special character!",
        label: "User ID",
        // pattern: "^[A-Za-z0-9]{2,15}$",
        required: true,
      },
      {
        id: 2,
        name: "accountNumber",
        type: "text",
        placeholder: "Account number",
        errorMessage:
        "Account number should be 12-16 characters and shouldn't include any special character!",
        label: "Account number",
        pattern: "^[A-Za-z0-9]{12,16}$",
        required: true,
      },
      {
        id: 3,
        name: "balance",
        type: "number",
        placeholder: "Balance",
        errorMessage:
        "invalid balance",
        label: "Balance",
        // pattern: "[0-9]+([\.][0-9]?)?",
        required: true,
      },
    ];

    async function fetchAllAccounts() {
        await axios.get("http://localhost:5244/api/Account")
          .then(res => {
            if (res.status === 200) {
              setAccounts(res.data)
              console.log("list of accounts", accounts);
            }
          })
          .catch(err => console.log(err))
    }
    // Get all account type từ DB đổ lên 
    async function fetchDataAccountType() {
      await axios.get("http://localhost:5244/api/Account/TypeAccount")
          .then(res => {
              if (res.status == 200) {
                  setAccTypes(res.data)
              }
          })
          .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchAllAccounts();
        fetchDataAccountType();
    }, [])

    //Edit account
  async function handleEdit(id) {
    // alert(id);
    // console.log('id muốn edit la so: ', id);
    
    await axios.get(`http://localhost:5244/api/Account/${id}`)
      .then(res => {
        if (res.status === 200) {
          console.log('account cần edit', res.data);
          setAccountEdit(res.data);
        }
      })
      .catch(err => console.log(err));

    handleShow();
  }

  // Delete account
  const handleDelete = (id) => {
    if(window.confirm("Are you sure to delete this account?") === true)
    {
      // alert(id);
      axios.delete(`http://localhost:5244/api/Account/${id}`)
      .then(res => {
        // console.log('res', res);
        // fetchAllAccounts();
        // alert('delete account thành công');
        
        if (res.status === 204) {
          alert('delete account thành công');
          fetchAllAccounts();
        }
      })
      .catch(err => console.log(err));
    }
  }

    return(
      <div className="main-content-user">

        <h2>Account List</h2>
        <div className="transaction-history">
          <table className="table table-striped table-bordered table-hover" >
            <thead>
              <tr>
                <th>Account ID</th>
                <th>User ID</th>
                <th>Account Number</th>
                <th>Balance</th>
                <th>Type account ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts && accounts.length > 0 ? 
                accounts.map((item, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{item.accountId}</td>
                      <td>{item.userId}</td>
                      <td>{item.accountNumber}</td>
                      <td>{item.balance}</td>
                      <td>{item.typeAccountId}</td>
                      
                      <td className='anhao-button-container' colSpan={2}>
                        <button className='anhao-btn-primary' onClick={()=> handleEdit(item.accountId)}>Edit</button> &nbsp;
                        <button className='anhao-btn-danger' onClick={()=> handleDelete(item.accountId)}>Delete</button>
                      </td>
                    </tr>
                  )
                }) : 'Loading ...'
            }
            </tbody>
          </table>
        </div>
        
        <hr />

        {/* Form add account START*/}
        {/* <button className='btn btn-primary' onClick={()=> handleEdit(item.userId)}>Add User</button> */}
        <FormAddAccount inputs={inputs} setAccounts = {setAccounts} accTypes={accTypes}/>
        {/* Form add account END*/}


        {/* Pop-up modal edit account START */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            {/* <Modal.Title>Form Edit Account</Modal.Title> */}
            <h2>Form Edit Account</h2>
          </Modal.Header>

          <Modal.Body>
            <FormEditAccount accounts={accounts} accTypes={accTypes} accountEdit={accountEdit} fetchAllAccounts = {fetchAllAccounts} handleClose ={handleClose} inputs={inputs}/>
          </Modal.Body>
        </Modal>
        {/* Pop-up modal edit account END */}
      </div>
    );
}

export default AccountCRUD;