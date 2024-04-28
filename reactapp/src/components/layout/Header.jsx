import React from 'react';
import { Row, Col, Layout, Button } from 'antd';
const { Header } = Layout;
import { UserOutlined } from "@ant-design/icons";
import {useAuth} from "@/components/contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


const HeaderSection = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();    
    
    const handleLogout = () => {        
        logout(isAuthenticated);
    };
    const handleLogin = () => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    };   
        
    return (
        <Header
            style={{
                color: "white",
                width: "100%",
                height: 103,
                paddingLeft: 35,
                paddingRight: 35, 
            }}
        >
            <Row
                align="middle"
                style={{
                    height: 92,                   
                    paddingTop: 8
                }}
            >
                <Col flex={2}></Col>               
                
                {isAuthenticated ? (
                    <>
                        <Col style={{ textAlign: 'right', marginLeft: 25 }}>
                            Welcome, {user.userName}
                        </Col>
                        <Col>
                            <div
                                style={{
                                    height: 40,
                                    width: 40,
                                    marginRight: 15,
                                    backgroundColor: '#545B64',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    marginLeft: 14,
                                }}
                            >
                                <UserOutlined />
                                
                            </div>                            
                        </Col>                          
                        <Col>
                            <Button onClick={handleLogout}>Выйти</Button>
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