import React from 'react';
import { Outlet } from 'react-router-dom';
import "./SideBarLayout.css"
import Sidebar from '../../Components/SideBar/SideBar';




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
