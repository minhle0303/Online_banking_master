import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Home from "./Components/Home";
import ServiceRequest from './Components/ServiceRequest';
import Feature from "./Components/Service";
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
            <Feature />
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
        </Route>
      </Routes>

      <Routes>
      <Route path="/user" element={<LayoutUser />}>
                <Route index element={<MainContent />} />  
                <Route path="home" element={<MainContent />} />
                <Route path="transfer" element={<Transfer />} />
                <Route path="cheque" element={<Cheque />} />
                <Route path="open-account" element={<OpenAccount />} />
                <Route path="service-rq" element={<ServiceRequest />} />
            </Route>
      </Routes>

   
      
    </>
  );
}

export default App;