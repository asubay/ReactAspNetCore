import { Menu, Layout } from 'antd';
import { TrademarkOutlined, UserOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import {useAuth} from "@/components/contexts/AuthContext.jsx";

const MenuSection = ({theme}) => {
    const { Sider } = Layout;
    const { isAdmin } = useAuth();
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
            <Link to="/" className="link">Главная</Link>,
            'home',
            <LinkOutlined className="icon" />
        ),
    ];

    if (isAdmin) {
        items.push(
            getItem(
                <Link className="link">Администрирование</Link>,
                'administration',
                <SettingOutlined className="icon" />,
                [
                    getItem(
                        <Link to="/role" className="link">Роли</Link>,
                        'role',
                        <TrademarkOutlined className="icon" />
                    ),
                    getItem(
                        <Link to="/user" className="link">Пользователи</Link>,
                        'user',
                        <UserOutlined className="icon" />
                    )
                ]
            )
        );
    }

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