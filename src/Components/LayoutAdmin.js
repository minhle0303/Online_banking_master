import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './adminPages/Sidebar';
import Footer from './Footer';
import HeaderUser from './userPages/HeaderUser';

function LayoutAdmin() {
    return (
        <div>
            <Sidebar />
            {/* Header user là cái nút nhỏ */}
            <HeaderUser /> 
            {/* Outlet nằm trong App.js */}
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default LayoutAdmin;