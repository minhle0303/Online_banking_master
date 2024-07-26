import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderUser from './userPages/HeaderUser';
import Footer from './Footer';
import Sidebar from './userPages/Sidebar';


function LayoutUser() {
    return (
        <div>
            <Sidebar />
            <HeaderUser />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default LayoutUser;