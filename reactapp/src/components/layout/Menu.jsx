import { Menu, Layout } from 'antd';
import { TrademarkOutlined, UserOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons';

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
            <LinkOutlined className="icon"/>,
        ),
        getItem(
            <a href="/" target="_blank" rel="noopener noreferrer" className="link">
                Администрирование
            </a>,
            'administration',
            <SettingOutlined className="icon"/>,
            [
                getItem(
                <a href="/role" rel="noopener noreferrer" className="link">
                    Роли
                </a>, 
                'role',
                <TrademarkOutlined className="icon"/>),
                getItem(
                    <a href="/user" rel="noopener noreferrer" className="link">
                        Пользователи
                    </a>,
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