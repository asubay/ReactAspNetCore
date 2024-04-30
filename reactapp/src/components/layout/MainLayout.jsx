import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/components/contexts/AuthContext.jsx";
import {Layout} from "antd";
import HeaderSection from "@/components/layout/Header.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import MenuSection from "@/components/layout/Menu.jsx";

const MainLayout = () => {
    return  (<>
        <Layout hasSider>
            <HeaderSection/>
            <Sidebar
                content={
                    <div>
                        <MenuSection theme={"dark"}/>
                    </div>
                }
            />
        </Layout>
        <Layout className="layoutStyle">
            <Outlet />)
        </Layout>
    </>);
};

export default MainLayout;