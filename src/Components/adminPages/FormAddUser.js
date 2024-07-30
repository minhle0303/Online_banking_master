import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FormInput from "./FormInput";
import moment from 'moment';

function FormAddUser(props) {
    let {setUsers, inputs, users} = props;
    
    const [user, setUser] = useState({ 
        firstName: "",
        lastName: "", 
        username: "", 
        email: "", 
        dob: "", 
        address: "", 
        phone: "", 
        password: "",
        pin: "",
        role: "admin"
    });

    // Add dòng này để làm confirm password
    inputs[8].pattern = user.password;
    
    function handleChangeInput(e){
        // let {name,value} = e.target;
        // setProduct({...product,[name]:value});

        setUser({ ...user, [e.target.name]: e.target.value });
    }

    // function được gọi trong handleSubmit để check age > 18 hay không
    function validateDate(date){
        var eighteenYearsAgo = moment().subtract(18, "years");
        var birthday = moment(date);
        
        if (!birthday.isValid()) {
            return "invalid date";   
        }
        else if (eighteenYearsAgo.isAfter(birthday)) {
            return "good";    
        }
        else {
            return "bad";    
        }
    }

    async function handleSubmit(e){
        e.preventDefault();

        if (validateDate(user.dob) === 'bad') {
            alert('age must be greater than 18');
            return;
        }

        const phoneExisted = users.findIndex((item) => item.phone === user.phone);
        if(phoneExisted !== -1) {
            alert('Phone number đã tồn tại');
            return;
        }
        const emailExisted = users.findIndex((item) => item.email === user.email);
        if(emailExisted !== -1) {
            alert('Email đã tồn tại');
            return;
        }
        const usernameExisted = users.findIndex((item) => item.username === user.username);
        if(usernameExisted !== -1) {
            alert('Username đã tồn tại');
            return;
        }

        if (user.role === '') {
            alert('Please choose a role');
            return;
        }

        // SELF-NOTE: không cần delete confirmPassword
        // delete user.confirmPassword;
        console.log('user chuan bi add', user);
        await axios.post("http://localhost:5244/api/User", user)
            .then(res=>{
                setUsers(pre=>[...pre,res.data])
                // Reset lại các trường input trong form
                // setUser({ 
                //     firstName: "", 
                //     lastName: "", 
                //     userName: "", 
                //     email: "", 
                //     dOB: "", 
                //     address: "", 
                //     phone: "", 
                //     password: "",
                //     pIN: "",
                //     role: ""
                // });
                // console.log('add user successfully');
                alert('Add user successfully!');
            })
            .catch(err=>console.log(err))
    }

    return (
        <div className='form-container'>
            <h2>FORM ADD NEW USER</h2>

            <form className="transfer-form" onSubmit={handleSubmit}>
                {inputs.map((input) => (
                <FormInput
                    key={input.id}
                    {...input} // input ko có 's'
                    value={user[input.name]}
                    onChange={handleChangeInput}
                />
                ))}

                {/* <div className="mb-3 mt-3">
                    <label htmlFor="category" className="form-label">Role:</label>
                    <select className="form-select" name='role' onChange={handleChangeInput}>
                        <option value="">--Please choose an option--</option>
                        <option key="admin" value="admin">Admin</option>
                        <option key="user" value="user">User</option>
                    </select>
                </div> */}
                
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>


            {/* <form onSubmit={handleSubmit}>

                <div className="mb-3 mt-3">
                    <label htmlFor="firstName" className="form-label">First Name:</label>
                    <input type="text" className="form-control"
                        onChange={handleChangeInput} value={product.firstName}
                        placeholder="Enter first name" name="firstName" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                    <input type="text" className="form-control"
                        onChange={handleChangeInput} value={product.lastName}
                        placeholder="Enter last name" name="lastName" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">Username:</label>
                    <input type="text" className="form-control"
                        onChange={handleChangeInput} value={product.userName}
                        placeholder="Enter Username" name="userName" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">Email:</label>
                    <input type="email" className="form-control"
                        onChange={handleChangeInput} value={product.email}
                        placeholder="Enter Email" name="email" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">Date of Birth:</label>
                    <input type="date" className="form-control"
                        onChange={handleChangeInput} value={product.dOB}
                        placeholder="Enter Date of Birth" name="dOB" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">Address:</label>
                    <input type="text" className="form-control"
                        onChange={handleChangeInput} value={product.address}
                        placeholder="Enter Address" name="address" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">Phone:</label>
                    <input type="number" className="form-control"
                        onChange={handleChangeInput} value={product.phone}
                        placeholder="Enter Phone" name="phone" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">Password:</label>
                    <input type="text" className="form-control"
                        onChange={handleChangeInput} value={product.password}
                        placeholder="Enter Password" name="password" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="name" className="form-label">PIN:</label>
                    <input type="number" className="form-control"
                        onChange={handleChangeInput} value={product.pIN}
                        placeholder="Enter PIN" name="pIN" />
                </div>
                
                <div className="mb-3 mt-3">
                    <label htmlFor="category" className="form-label">Role:</label>
                    <select className="form-select" name='role' onChange={handleChangeInput}>
                        <option value="">--Please choose an option--</option>
                        <option key="admin" value="admin">Admin</option>
                        <option key="user" value="user">User</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form> */}
        </div>
    );
}

export default FormAddUser;