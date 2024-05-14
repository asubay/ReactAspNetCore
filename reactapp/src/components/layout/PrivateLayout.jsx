import React from "react";
import { Link} from "react-router-dom";
import {useAuth} from "@/components/contexts/AuthContext.jsx";
import PublicLayout from "@/components/layout/MainLayout.jsx";

const PrivateLayout = () => {
    const { isAuthenticated, loading  } = useAuth();
    if (loading) {
        return <div>Loading...</div>; 
    }
    if (!isAuthenticated) return <Link to={`/login`}/>
    return <PublicLayout/>;
};

export default PrivateLayout;