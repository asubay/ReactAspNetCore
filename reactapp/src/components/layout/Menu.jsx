import { Menu, Layout } from 'antd';
import { TrademarkOutlined, UserOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";

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
            <Link to="/" className="link">
                Главная
            </Link>,
            'home',
            <LinkOutlined className="icon"/>,
        ),
        getItem(
            <Link to="/" target="_blank"  className="link">
                Администрирование
            </Link>,
            'administration',
            <SettingOutlined className="icon"/>,
            [
                getItem(
                    <Link to="/role" className="link">
                     Роли
                    </Link>, 
                'role',
                <TrademarkOutlined className="icon"/>),
                getItem(
                    <Link to="/user" className="link">
                        Пользователи
                    </Link>,
                    'user',
                    <UserOutlined className="icon"/>)
            ]
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