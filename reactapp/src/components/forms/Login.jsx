import {useAuth} from "@/components/contexts/AuthContext.jsx";
import { Button, Form, Input, Row, Col, Alert } from 'antd';
import React, { useState } from 'react';

const Login = () => {
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    
    const onFinish = async (values) => {
        try {
            await login(values);
        } catch (error) {            
            setErrorMessage(error.message);
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <div className="container">
            <Row justify="center" align="middle" style={{ minHeight: '50vh' }}>
                <Col span={24} style={{ maxWidth: 600 }}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{ border: '1px solid #d9d9d9', borderRadius: '5px', padding: '20px', 
                            boxShadow: '0 5px 8px rgba(0,0,0,0.1)' }}
                    >
                        {errorMessage && (
                            <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '16px' }} />
                        )}
                        <Form.Item
                            label="Логин"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Вы не заполнили логин!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Вы не заполнили пароль!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>                         
                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }} >
                            <Button type="primary" htmlType="submit">
                                войти
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>  
    );
};

export default Login;