import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

import FormAddUser from './FormAddUser';
import FormEditUser from './FormEditUser';
import Pagination from './Pagination';

function UserCRUD() {
    // Để open/close modal window edit user
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    // Pagination START
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10); // số dòng muốn hiện trong 1 page
    // Pagination END
    
    const [users, setUsers] = useState([]); // list of all User
    const [userEdit, setUserEdit] = useState({}); // user đang cần edit
  
    // Chứa regex & error messages for Form validation
    const inputs = [
      {
          id: 1,
          name: "firstName", // phải giống định dạng database trả về
          type: "text",
          placeholder: "first name",
          errorMessage:
          "First name should be 2-15 characters and shouldn't include any special character!",
          label: "First Name",
          pattern: "^[A-Za-z0-9]{2,15}$",
          required: true,
      },
      {
          id: 2,
          name: "lastName",
          type: "text",
          placeholder: "last name",
          errorMessage:
          "Last name should be 2-15 characters and shouldn't include any special character!",
          label: "Last Name",
          pattern: "^[A-Za-z0-9]{2,15}$",
          required: true,
      },
      {
          id: 3,
          name: "username",
          type: "text",
          placeholder: "user name",
          errorMessage: "username is 8-20 characters long",
          label: "Username",
          pattern: "^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$",
          required: true,
      },
      {
          id: 4,
          name: "email",
          type: "email",
          placeholder: "Email",
          errorMessage: "It should be a valid email address!",
          label: "Email",
          required: true,
      },
      {
          id: 5,
          name: "dob",
          type: "date",
          placeholder: "Date of birth",
          label: "Date of Birth",
      },
      {
          id: 6,
          name: "address",
          type: "text",
          placeholder: "address",
          errorMessage:
          "Address name should be 3-16 characters and shouldn't include any special character!",
          label: "Address",
          // pattern: "^[A-Za-z0-9]{3,16}$",
          required: true,
      },
      {
          id: 7,
          name: "phone",
          type: "number",
          placeholder: "phone",
          errorMessage:
          "Phone should be 3-16 characters and shouldn't include any special character!",
          label: "Phone Number",
          // pattern: "^[A-Za-z0-9]{3,16}$",
          required: true,
      },
      {
          id: 8,
          name: "password",
          type: "password",
          placeholder: "Password",
          errorMessage:
          "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          label: "Password",
          // pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true,
      },
      {
        id: 9,
        name: "confirmPassword",
        type: "password",
        placeholder: "Confirm Password",
        errorMessage: "Passwords don't match!",
        label: "Confirm Password",
        // pattern: user.password,
        required: true,
      },
      {
          id: 10,
          name: "pin",
          type: "text",
          placeholder: "PIN",
          errorMessage:
          "PIN name should be 4 characters and shouldn't include any special character!",
          label: "PIN code",
          pattern: "^[A-Za-z0-9]{4}$",
          required: true,
      }
    ];
  
    async function fetchAllUsers() {
      await axios.get("http://localhost:5244/api/User")
        .then(res => {
          if (res.status === 200) {
            setUsers(res.data)
          }
        })
        .catch(err => console.log(err))
    }
    useEffect(() => {
      fetchAllUsers();
    }, []) // [] dependency only run after the initial render.
    console.log("list of users", users);
  
    // For Pagination, phải đặt sau useEffect()
    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentUsers = users.slice(firstPostIndex, lastPostIndex);
  
    //Edit user
    async function handleEdit(id) {
      await axios.get(`http://localhost:5244/api/User/${id}`)
        .then(res => {
          if (res.status === 200) {
            setUserEdit(res.data);
          }
        })
        .catch(err => console.log(err));
  
      handleShow(); // mở modal window
    }

    async function handleChangeStatus(id) {
      await axios.put(`http://localhost:5244/api/User/${id}/change-account-locked`, id)
        .then(res => {
          if (res.status === 200) {
            // console.log('change status thanh cong');
            fetchAllUsers();
          }
        })
        .catch(err => console.log(err));
    }
  
    // Không cho delete user
    // const handleDelete = (id) => {
    //   if(window.confirm("Are you sure to delete this user?") === true)
    //   {
    //     // alert(id);
    //     axios.delete(`http://localhost:5244/api/User/${id}`)
    //     .then(res => {
    //       if (res.status === 200) {
    //         // console.log('user cần edit', res.data.data);
    //         // setUserEdit(res.data.data);
    //         console.log('delete thành công');
    //         // setProducts(products);
    //         fetchAllUsers();
    //         // App.forceUpdate();
    //       }
    //     })
    //     .catch(err => console.log(err));
    //   }
    // }
  
    return (
      <div className="main-content-user">
        <h2>User List</h2>
        <div className="transaction-history">
          <table className="table table-striped table-bordered table-hover" >
            <thead>
              <tr>
                <th>User ID</th>
                {/* <th>First Name</th> */}
                {/* <th>Last Name</th> */}
                <th>Username</th>
                <th>Email</th>
                {/* <th>Date of Birth</th> */}
                {/* <th>Address</th> */}
                <th>Phone Number</th>
                {/* <th>Password</th> */}
                {/* <th>PIN</th> */}
                {/* <th>Role</th> */}
                {/* <th>Failed Login Attempts</th> */}
                <th>User status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers && currentUsers.length > 0 ? 
                currentUsers.map((item, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{index + 1}</td> */}
                      <td>{item.userId}</td>
                      {/* <td>{item.firstName}</td> */}
                      {/* <td>{item.lastName}</td> */}
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                      {/* <td>{item.dob}</td> */}
                      {/* <td>{item.address}</td> */}
                      <td>{item.phone}</td>
                      {/* <td>{item.pin}</td> */}
                      {/* <td>{item.role}</td> */}
                      {/* <td>{item.failedLoginAttempts}</td> */}
                      {/*0 là false 1 là true*/}
                      <td>{item.accountLocked ? 'locked' : 'active'}</td>
                      <td className='anhao-button-container' colSpan={2}>
                        <button className='anhao-btn-primary' onClick={()=> handleEdit(item.userId)}>Edit</button> &nbsp;
                        {/* <button  onClick={()=> console.log('user detail')}>Detail</button> */}
                        <button className='anhao-btn-warning' onClick={()=> handleChangeStatus(item.userId)}>Change status</button>
                        {/* <button className='btn btn-danger' onClick={()=> handleDelete(item.userId)}>Delete</button> */}
                      </td>
                    </tr>
                  )
                }) : 'Loading ...'
              }
            </tbody>
          </table>
        </div>
        
        <Pagination
            totalPosts={users.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
        />
        <hr />
  
        {/* Form add user START*/}
        <FormAddUser inputs={inputs} users={users} setUsers = {setUsers} />
        {/* Form add user END*/}
  
        {/* Pop-up modal edit user */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Form Edit user</Modal.Title>
          </Modal.Header>
  
          <Modal.Body>
            {/* <h1>Form edit user</h1> */}
            <FormEditUser users={users} userEdit = {userEdit} fetchAllUsers = {fetchAllUsers} handleClose ={handleClose} inputs={inputs}/>
          </Modal.Body>
  
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={()=>{}}>
              Save Changes
            </Button>
          </Modal.Footer> */}
        </Modal>
  
      </div>
    );
  }
  
  export default UserCRUD;
  