import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './adminPages/Sidebar';
import Footer from './Footer';
import HeaderUser from './userPages/HeaderUser';

function LayoutAdmin() {
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

export default LayoutAdmin;