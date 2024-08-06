import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FormInput from "./FormInput";

function FormEditUser({users, userEdit, fetchAllUsers, handleClose, inputs}) {
    // let {setUsers, inputs, users} = props;
    // Cái này khác với cái user bên FormAddUser
    const [user, setUser] = useState(userEdit);
    // setUser({...user,password:''});
    // console.log('user', user);
    
    // Change the inputs array
    // console.log(inputs);
    let index = inputs.findIndex((item) => item.name === "firstName");
    if (index > -1) { // only splice array when item is found
        inputs.splice(index, 3); // 2nd parameter means remove one item only
    }
    index = inputs.findIndex((item) => item.name === "dob");
    if (index > -1) { // only splice array when item is found
        inputs.splice(index, 1); // 2nd parameter means remove one item only
    }
    index = inputs.findIndex((item) => item.name === "confirmPassword");
    if (index > -1) { // only splice array when item is found
        inputs.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log('new inputs array', inputs); 

    // Add để làm confirm password
    // inputs[8].pattern = user.password;
    
    function handleChangeInput(e){
        let {name,value} = e.target;
        setUser({...user,[name]:value});
    }

    async function handleSubmit(e){
        e.preventDefault();

        if (user.role === '') {
            alert('Please choose a role');
            return;
        }

        delete user.confirmPassword;

        // console.log(user);
        await axios.put(`http://localhost:5244/api/User/${user.userId}`,user)
            .then(res=>{
                alert('edit user successfully');
                fetchAllUsers();
                handleClose();
            })
            .catch(err=>console.log(err))
    }

    return (
        <div className='row'>
            <form onSubmit={handleSubmit}>

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

                <button type="submit" className="btn btn-primary">Submit</button> &nbsp;
                {/* <button className='btn btn-secondary' onClick={handleClose}>Close</button> */}
            </form>
        </div>
    );

}

export default FormEditUser;