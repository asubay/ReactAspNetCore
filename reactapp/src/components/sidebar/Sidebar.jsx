import React from 'react';
import { Layout } from 'antd';
import './Style.css'

const { Sider } = Layout;

const Sidebar = ({content}) => {    
  
    return (
        <Sider
            width={400}           
            style={{
                padding: 24,
                background: "rgb(25 55 90)"
            }}
        >
            {content}            
        </Sider>

    );
};

export default Sidebar;