import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FormInput from "./FormInput";

function FormEditAccount(props) {
    let {accounts, accountEdit, fetchAllAccounts, handleClose, inputs, accTypes} = props;
    const [account, setAccount] = useState(accountEdit);
    // setProduct(props.userEdit);
    // console.log('prop trong FormEdituser', product);

    function handleChangeInput(e){
        let {name,value} = e.target;
        setAccount({...account,[name]:value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        
        await axios.put(`http://localhost:5244/api/Account/${account.accountId}`,account)
            .then(res=>{
                // console.log("res: ",res);
                // console.log("create: ",res.data.data);
                // setUsers(pre=>[...pre,res.data]);
                console.log('Edit account successfully!');
                fetchAllAccounts();
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

                <button type="submit" className="btn btn-primary">Submit</button> &nbsp;
                {/* <button className='btn btn-secondary' onClick={handleClose}>Close</button> */}
            </form>
        </div>
    );

}

export default FormEditAccount;