import * as Icons from "@ant-design/icons";
import { Menu, Layout } from 'antd';


const MenuSection = ({theme}) => {
    const { Sider } = Layout;
    
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
            <a href="/" target="_blank" rel="noopener noreferrer" className="link">
                Главная
            </a>,
            'home',
            <Icons.LinkOutlined className="icon"/>,
        ),
        getItem(
            <a href="/" target="_blank" rel="noopener noreferrer" className="link">
                Администрирование
            </a>,
            'admin',
            <Icons.SettingOutlined className="icon"/>,
            [getItem(
                <a href="yka-car-accident" target="_blank" rel="noopener noreferrer" className="link">
                    Пользователи
                </a>,
                'users',
                <Icons.UserOutlined className="icon"/>),]
        )
    ];
    
    return (
        <div>
            <Sider width={300} style={{               
                marginTop: 65                
            }}>
                <Menu
                    mode="inline"
                    theme={theme}
                    defaultSelectedKeys={['home']}
                    items={items}
                    selectedKeys={[]}
                />
            </Sider>
        </div>
    );
};

export default MenuSection;