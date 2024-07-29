import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FormInput from "./FormInput";

function FormAddAccount(props) {
    let {inputs, setAccounts, accTypes} = props;
    // danh sách users
    const [users, setUsers] = useState([]);
    const [account, setAccount] = useState({ 
        userId: "", 
        accountNumber: "",
        balance: "",
        typeAccountId: ""
    });

    // Get all users từ DB đổ lên 
    async function fetchDataUser() {
        await axios.get("http://localhost:5244/api/User")
            .then(res => {
                if (res.status == 200) {
                    setUsers(res.data)
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchDataUser();
        
    }, [])
    
    function handleChangeInput(e){
        let {name,value} = e.target;
        setAccount({...account,[name]:value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        console.log(account); // ổn rồi
        await axios.post("http://localhost:5244/api/Account", account)
            .then(res=>{
                // console.log("res: ",res);
                // console.log("create: ",res.data.data);
                setAccounts(pre=>[...pre,res.data])
                // Reset lại các trường input
                // setAccount({ 
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
                alert('add account successfully');
            })
            .catch(err=>console.log(err))
    }

    return (
        <div className='row'>
            <h2>FORM ADD NEW ACCOUNT</h2>
            <form onSubmit={handleSubmit}>
                {inputs.map((input) => (
                <FormInput
                    key={input.id}
                    {...input} // input ko có 's'
                    value={account[input.name]}
                    onChange={handleChangeInput}
                />
                ))}

                <div className="mb-3 mt-3">
                    <label htmlFor="category" className="form-label">Account type:</label>
                    <select className="form-select" name='typeAccountId' onChange={handleChangeInput}>
                        <option value="">--Please choose an option--</option>
                        {accTypes.map((item, index) => {
                            return (<option key={index} value={item.typeAccountId}>{item.type}</option>)
                        })}
                    </select>
                </div>

                {/* <div className="mb-3 mt-3">
                    <label htmlFor="category" className="form-label">User ID:</label>
                    <select className="form-select" name='userId' onChange={handleChangeInput}>
                        {users.map((item, index) => {
                            return (<option key={index} value={item.userId}>{item.username}</option>)
                        })}
                    </select>
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="firstName" className="form-label">Account Number:</label>
                    <input type="text" className="form-control"
                        onChange={handleChangeInput} value={account.accountnumber}
                        placeholder="Enter account number" name="accountnumber" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="firstName" className="form-label">Balance:</label>
                    <input type="number" className="form-control"
                        onChange={handleChangeInput} value={account.balance}
                        placeholder="Enter balance" name="balance" />
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="category" className="form-label">Account type:</label>
                    <select className="form-select" name='typeAccountId' onChange={handleChangeInput}>
                        {accTypes.map((item, index) => {
                            return (<option key={index} value={item.typeAccountId}>{item.type}</option>)
                        })}
                    </select>
                </div> */}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default FormAddAccount;