import React from 'react';
import { Outlet } from 'react-router-dom';
import './sidebarLayout.css'; // You'll create a CSS file for layout-specific styling
import Navbar from '../components/navbar/navbar';

const SidebarLayout = () => {
    return (
        <div className="sidebar-layout">
            <Navbar />
            <div className="sidebar-layout-content">
                <Outlet /> 
            </div>
        </div>
    );
};

export default SidebarLayout;
