import React from 'react';
import {Layout, Sider } from 'antd';

const Sidebar = ({colorBgContainer}) => {
    
    return (
        <div>
            <Layout>
                <Sider width={200}
                       style={{
                           background: colorBgContainer,
                       }}>
                    
                </Sider>
            </Layout>
        </div>
    );
};

export default Sidebar;