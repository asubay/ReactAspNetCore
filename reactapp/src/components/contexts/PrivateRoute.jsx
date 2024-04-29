import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/components/contexts/AuthContext.jsx";

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    console.log('isAuthenticated', isAuthenticated);
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <Outlet />;
};

export default PrivateRoute;