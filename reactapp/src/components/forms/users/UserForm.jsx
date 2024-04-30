import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Row, Checkbox, Alert, Select } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import HeaderSection from "@/components/layout/Header.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import MenuSection from "@/components/layout/Menu.jsx";
import { saveUserData, fetchGetRoles, getUser} from "@/services/api.js";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;

const UserForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const recordId = location.state && location.state.recordId;
    const [errorMessage, setErrorMessage] = useState('');
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);

    const handleFormSubmit = async (values) => {
        try {
            const id = recordId === null ? "0" : recordId;            
            const data = { ...values, id: id };
            await saveUserData(data);
            navigate("/user");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        if (recordId) {
            getUser(recordId)
                .then(data => {                    
                    form.setFieldsValue({
                        username: data.username,
                        id: data.id,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        isActive: data.isActive,
                        role: data.role
                    });
                })
                .catch(error => {
                    setErrorMessage(error.message);
                });
        }
    }, [recordId]);

    useEffect(()=>
    {        
        const fetchRolesList = async () => {
            try {
                const data = await fetchGetRoles();
                setRoles(data);

            } catch (error) {
                console.error('Error fetching get roles:', error);
            }
            finally {
                console.log('Success get roles')                
            }
        };
        fetchRolesList();
    }, [])

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <>
            <Content>
                <div className="container-fluid">
                    <div className="row mt-3">
                        <div>
                            <h3 style={{textAlign: "left"}}>
                                {recordId ? ("Редактирование") : ("Добавление нового пользователя")}
                            </h3>
                            <hr/>
                        </div>
                    </div>
                </div>
                <Row justify="center" align="middle" style={{backgroundColor:"white"}}>
                    <div className="col-6 mt-4">
                        <Form
                            form={form}
                            name="edit_user"
                            onFinish={handleFormSubmit}
                            onFinishFailed={onFinishFailed}>

                            {errorMessage && (
                                <Alert message={errorMessage} type="error" showIcon
                                       style={{marginBottom: '16px'}}/>
                            )}
                            <Form.Item name="id" hidden>
                                <Input/>
                            </Form.Item>

                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Введите логин!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Логин" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Введите email!' }]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email" />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Введите номер телефона!' }]}
                            >
                                <Input prefix={<PhoneOutlined />} placeholder="Номер телефона" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введите пароль!'
                                    },
                                    {
                                        min: 6,
                                        message: 'Пароль должен содержать минимум 6 символов!'
                                    },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]+$/,
                                        message: 'Пароль должен содержать хотя бы одну строчную и заглавную буквы, одну цифру и один специальный символ!'
                                    }
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                            </Form.Item>

                            <Form.Item
                                name="role"
                                rules={[{ required: true, message: 'Выберите роль для пользователя' }]}
                            >
                                <Select placeholder="Роль">
                                    {roles.map((role) => (
                                        <Option key={role.id} value={role.id}>
                                            {role.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="isActive" valuePropName="checked">
                                <Checkbox>Активный</Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Сохранить
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Row>
            </Content>
        </>
    );
};

export default UserForm;