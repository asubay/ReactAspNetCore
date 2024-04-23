import React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

const Sidebar = ({content}) => {    
  
    return (
        <Sider
            width={300}
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            {content}            
        </Sider>

    );
};

export default Sidebar;