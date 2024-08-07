import { useEffect, useState } from 'react';
// import './App.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import FormAddAccount from './FormAddAccount';
import FormEditAccount from './FormEditAccount';

import "./anhao.css";

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
// import './App.css';
import { useRef } from 'react';

function AccountCRUD() {

    // làm phần xuất pdf
    const [transactions, setTransactions] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const ref = useRef();
    
    const generatePDF = () => {
      console.log('use ref', ref.current);
      //Hàm html2canvas được sử dụng để tạo một ảnh
      // của phần tử DOM được truyền vào qua tham chiếu ref
      html2canvas(ref.current).then(canvas => {
        // Phương thức toDataURL của đối tượng canvas
        // được sử dụng để chuyển đổi nó thành
        // một chuỗi dữ liệu base64,
        // biểu diễn ảnh dưới dạng PNG
        // var width = 50
        // var height = 50
        // const imgData = canvas.toDataURL('image/png');
        // const pdf = new jsPDF({ unit: 'in', format: [width, height],});
        
        // //Hàm addImage của đối tượng PDF được sử dụng
        // // để thêm ảnh từ chuỗi dữ liệu base64
        // // vào tài liệu PDF
        // pdf.addImage(imgData, 'PNG',0,0, width, height);
        // pdf.save('list-table.pdf');


        var pdf = new jsPDF("l", "mm", "a4");
        var imgData = canvas.toDataURL('image/jpeg', 1.0);

        // due to lack of documentation; try setting w/h based on unit
        pdf.addImage(imgData, 'JPEG', 10, 10, 180, 150);  // 180x150 mm @ (10,10)mm
        pdf.save('list-table.pdf');
        });
    };
    // xuât pdf END
    
    // For edit modal pop-up START
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // For edit modal pop-up END

    // Pagination START
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10); // số dòng muốn hiện trong 1 page
    // Pagination END

    const [users, setUsers] = useState([]);
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
        "User ID is required",
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

    async function fetchAllUsers() {
      await axios.get("http://localhost:5244/api/User")
        .then(res => {
          if (res.status === 200) {
            setUsers(res.data)
          }
        })
        .catch(err => console.log(err))
    }
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
              if (res.status === 200) {
                  setAccTypes(res.data)
              }
          })
          .catch(err => console.log(err))
    }

    useEffect(() => {
      fetchAllUsers();
      fetchAllAccounts();
      fetchDataAccountType();
    }, [])

    useEffect(() => {
      // console.log('selected acc', selectedAccount);

      if (selectedAccount) {
          const fetchTransactions = async () => {
              try {
                  console.log("select:", selectedAccount);
                  const receivedTransfers = await axios.get(`http://localhost:5244/api/Account/receivedTransfers/${selectedAccount}`);
                  const sentTransfers = await axios.get(`http://localhost:5244/api/Account/sentTransfers/${selectedAccount}`);

                  const formattedReceived = receivedTransfers.data.map(tx => ({ ...tx, type: 'received' }));
                  const formattedSent = sentTransfers.data.map(tx => ({ ...tx, type: 'sent' }));

                  const allTransactions = [...formattedReceived, ...formattedSent].sort((a, b) => new Date(b.transferDate) - new Date(a.transferDate));
                  setTransactions(allTransactions);
                  console.log("trans", transactions);
              } catch (error) {
                  console.error('Error fetching transactions:', error);
              } finally {
                  // setLoading(false);
              }
          };

          fetchTransactions();
      }
      
    }, [selectedAccount]);

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
    // không cho delete

    // if(window.confirm("Are you sure to delete this account?") === true)
    // {
    //   // alert(id);
    //   axios.delete(`http://localhost:5244/api/Account/${id}`)
    //   .then(res => {
    //     // console.log('res', res);
    //     // fetchAllAccounts();
    //     // alert('delete account thành công');
        
    //     if (res.status === 204) {
    //       alert('delete account thành công');
    //       fetchAllAccounts();
    //     }
    //   })
    //   .catch(err => console.log(err));
    // }
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
                        <button className='anhao-btn-success' onClick={()=> handleEdit(item.accountId)}>Add balance</button> &nbsp;
                        <button className='anhao-btn-primary' onClick={(e) => setSelectedAccount(item.accountId)}>List Transactions</button>
                      </td>
                    </tr>
                  )
                }) : 'Loading ...'
            }
            </tbody>
          </table>
        </div>
        
        <hr />

        <h3>List transaction</h3>
        <button onClick={generatePDF} className='anhao-btn-primary'>Download as PDF</button>
        <div className="transaction-history" ref={ref}>
        
                {/* {selectedTransaction && <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />} */}
                {transactions.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Sender Name</th>
                                    <th>Message</th>
                                    <th>Recipient</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.transferId} onClick={() => console.log('click on row')}>
                                        <td>{`${new Date(tx.transferDate).toLocaleDateString()} - ${new Date(tx.transferDate).toLocaleTimeString()}`}</td>
                                        <td>{tx.fromAccount?.user?.firstName} {tx.fromAccount?.user?.lastName }</td>
                                        <td>{tx.description}</td>
                                        <td>{tx.toAccount?.user?.firstName} {tx.toAccount?.user?.lastName}  </td>
                                        <td className={tx.type === 'received' ? 'amount received' : 'amount sent'}>
                                            {tx.type === 'received' ? `+${tx.amount} USD` : `-${tx.amount} USD`}
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                        </table>
                        {/* <div className="pagination">
                            {pageNumbers.map(number => (
                                <button key={number} onClick={() => setCurrentPage(number)} className={currentPage === number ? 'active' : ''}>
                                    {number}
                                </button>
                            ))}
                        </div> */}
                    </>
                ) : (
                    selectedAccount && <div>No transactions found for this account.</div>
                )}
        </div>

        <hr />

        {/* Form add account START*/}
        {/* <button className='btn btn-primary' onClick={()=> handleEdit(item.userId)}>Add User</button> */}
        <FormAddAccount inputs={inputs} setAccounts = {setAccounts} accTypes={accTypes} accounts={accounts}/>
        {/* Form add account END*/}


        {/* Pop-up modal edit account START */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            {/* <Modal.Title>Form Edit Account</Modal.Title> */}
            <h2>Add Balance</h2>
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