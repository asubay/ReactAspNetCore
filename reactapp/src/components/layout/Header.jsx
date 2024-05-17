import React, { useMemo } from "react";
import { Row, Col, Layout, Button, Avatar, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "@/components/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const rowStyle = {
    height: 92,
    paddingTop: 8,
};

const HeaderSection = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(isAuthenticated);
    };

    const handleLogin = () => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    };

    const menu = useMemo(
        () => (
            <Menu>
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                    Выйти
                </Menu.Item>
            </Menu>
        ),
        [handleLogout]
    );

    return (
        <Header className="headerStyle">
            <Row align="middle" style={rowStyle}>
                <Col flex={2}></Col>
                {isAuthenticated ? (
                    <>
                        <Col style={{ textAlign: "right", marginLeft: 25 }}>
                            Добро пожаловать, {user.userName}
                        </Col>
                        <Col>
                            <Dropdown overlay={menu} placement="bottomRight">
                                <div className="avatarStyle">
                                    {user.avatarByte ? (
                                        <Avatar size={40} src={`data:image/jpeg;base64,${user.avatarByte}`} />
                                    ) : (
                                        <UserOutlined />
                                    )}
                                </div>
                            </Dropdown>
                        </Col>
                    </>
                ) : (
                    <Col>
                        <Button onClick={handleLogin}>Войти</Button>
                    </Col>
                )}
            </Row>
        </Header>
    );
};

export default HeaderSection;
