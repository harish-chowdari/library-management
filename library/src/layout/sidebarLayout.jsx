import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/sidebar';
import './sidebarLayout.css'; // You'll create a CSS file for layout-specific styling

const SidebarLayout = () => {
    return (
        <div className="sidebar-layout">
            <Sidebar />
            <div className="sidebar-layout-content">
                <Outlet /> 
            </div>
        </div>
    );
};

export default SidebarLayout;
