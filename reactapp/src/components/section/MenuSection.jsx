import React, { useState } from 'react';
import {LinkOutlined} from "@ant-design/icons";
import { Menu } from 'antd';


const MenuSection = () => {
    
    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }

    const items = [        
        getItem(
            <a href="/" target="_blank" rel="noopener noreferrer" style={{color:"white"}}>
                Главная
            </a>,
            'link',
            <LinkOutlined style={{ color: "white" }}/>,
        ),
    ];
    
    return (
        <div>
            <Menu
                mode="inline"
                style={{                    
                    background: "rgb(25 55 90)"
                }}
                defaultSelectedKeys={['1']}
                items={items}
                selectedKeys={[]}
            />
        </div>
    );
};

export default MenuSection;