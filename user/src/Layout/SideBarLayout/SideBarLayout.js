import React from 'react';
import { Outlet } from 'react-router-dom';
import "./SideBarLayout.css"
import Navbar from '../../Components/Navbar/Navbar';




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
