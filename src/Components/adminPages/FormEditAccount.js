import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FormInput from "./FormInput";

function FormEditAccount(props) {
    let {accounts, accountEdit, fetchAllAccounts, handleClose, inputs, accTypes} = props;
    const [account, setAccount] = useState(accountEdit);
    const [changeValue, setChangeValue] = useState(0);
    // setProduct(props.userEdit);
    // console.log('prop trong FormEdituser', product);

    // Change the inputs array
    // console.log(inputs);
    const index = inputs.findIndex((item) => item.name === "userId");
    if (index > -1) { // only splice array when item is found
        inputs.splice(index, 2); // 2nd parameter means remove one item only
    }
    // console.log('new inputs array', inputs); 

    function handleChangeInput(e){
        setChangeValue(e.target.value);
        // let {name,value} = e.target;
        // setAccount({...account,[name]:value});
    }

    async function handleSubmit(e){
        e.preventDefault();
        // console.log('so tien thay doi', changeValue);

        const newBalance = account.balance + parseInt(changeValue);
        // console.log('newbalance', newBalance);
        account.balance = newBalance;
        // console.log('account sắp edit', account);
        
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

                {/* {inputs.map((input) => (
                    <FormInput
                        key={input.id}
                        {...input} // input ko có 's'
                        value={account[input.name]}
                        onChange={handleChangeInput}
                    />
                ))} */}

                <div className="mb-3 mt-3">
                    <label htmlFor="firstName" className="form-label">Change Value:</label>
                    <input type="number" min="0" className="form-control"
                        onChange={handleChangeInput} value={changeValue}
                        placeholder="Enter change value" name="firstName" />
                </div>

                {/* <div className="mb-3 mt-3">
                    <label htmlFor="category" className="form-label">Account type:</label>
                    <select className="form-select" name='typeAccountId' onChange={handleChangeInput}>
                        <option value="">--Please choose an option--</option>
                        {accTypes.map((item, index) => {
                            return (<option key={index} value={item.typeAccountId}>{item.type}</option>)
                        })}
                    </select>
                </div> */}

                <button type="submit" className="btn btn-primary">Submit</button> &nbsp;
                {/* <button className='btn btn-secondary' onClick={handleClose}>Close</button> */}
            </form>
        </div>
    );

}

export default FormEditAccount;