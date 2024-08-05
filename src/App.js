import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Home from "./Components/Home";
import ServiceRequest from './Components/ServiceRequest';

import Feature from "./Components/Service";
import DetailsPage from './Components/DetailsPage';/*********bo sung them dong nay********/

import Blog from "./Components/Blog";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import LoginForm from "./Components/LoginForm";
import Register from './Components/Register';
import MainContent from './Components/userPages/MainContent';
import Transfer from './Components/userPages/Transfer';
import Cheque from './Components/userPages/Cheque';
import OpenAccount from './Components/userPages/OpenAccount';
import LayoutUser from './Components/LayoutUser';
import LayoutAdmin from './Components/LayoutAdmin';

import TransactionHistory from './Components/userPages/TransactionHistory';
import ConverterForm from './Components/userPages/ConverterForm';

import Dashboard from './Components/adminPages/Dashboard';
import TransferAdmin from './Components/adminPages/TransferAdmin';
import TransferForm from './Components/adminPages/TransferForm';
import ListCheque from './Components/adminPages/ListCheque';
import ChequeForm from './Components/adminPages/ChequeForm';
import ListRequest from './Components/adminPages/ListRequest';
import RequestFrom from './Components/adminPages/RequestFrom';
import UserCRUD from './Components/adminPages/UserCRUD';
import AccountCRUD from './Components/adminPages/AccountCRUD';
import Statement from './Components/userPages/Statement';

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />

      </div>
    </Router>
    
  );
}

function AppContent() {
  const location = useLocation();
 
  return (
    <>

      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Feature/> 
            <Blog />
            <About />
            <Contact />
            <Footer />
          </>
        } />

  
      </Routes>

      <Routes>
        <Route element={<><Outlet/><Footer/></>}>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<Register />} />

          <Route path="/details/:serviceId" element={<DetailsPage />} /> {/* New route */}
      
        </Route>
      </Routes>

      <Routes>
      <Route path="/user" element={<LayoutUser />}>
                <Route index element={<MainContent />} />  
                <Route path="home" element={<MainContent />} />
                <Route path="transfer" element={<Transfer />} />
                <Route path="transaction/statement" element={<Statement />} />

                <Route path="transaction" element={<TransactionHistory />} />
                <Route path="foreign-currency" element={<ConverterForm />} />

                <Route path="cheque" element={<Cheque />} />
                <Route path="open-account" element={<OpenAccount />} />
                <Route path="service-rq" element={<ServiceRequest />} />
            </Route>
      </Routes>

      <Routes>
      <Route path="/admin" element={<LayoutAdmin />}>
                <Route index element={<Dashboard />} />  
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="transfer" element={<TransferAdmin />} />
                <Route path="transfer-form" element={<TransferForm />} />
                <Route path="cheque" element={<ListCheque/>} />
                <Route path="cheque-form" element={<ChequeForm/>} />
                <Route path="request-sv" element={<ListRequest/>} />
                <Route path="request-sv-form" element={<RequestFrom/>} />

                <Route path="userlist" element={<UserCRUD />} />
                <Route path="accountlist" element={<AccountCRUD />} />
            </Route>
      </Routes>

   
      
    </>
  );
}

export default App;