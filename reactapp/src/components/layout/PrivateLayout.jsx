import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/components/contexts/AuthContext.jsx";
import {Layout} from "antd";
import HeaderSection from "@/components/layout/Header.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import MenuSection from "@/components/layout/Menu.jsx";
import PublicLayout from "@/components/layout/MainLayout.jsx";

const PrivateLayout = () => {
    const { isAuthenticated } = useAuth();   
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    return <PublicLayout/>;
};

export default PrivateLayout;