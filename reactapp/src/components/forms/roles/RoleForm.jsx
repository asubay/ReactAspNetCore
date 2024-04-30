import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Row, Col, Alert } from 'antd';
import HeaderSection from "@/components/layout/Header.jsx";
import Sidebar from "@/components/layout/Sidebar.jsx";
import MenuSection from "@/components/layout/Menu.jsx";
import { editRole, getRole } from "@/services/api.js";
import { useNavigate, useLocation } from "react-router-dom";

const { Content } = Layout;

const RoleForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const recordId = location.state && location.state.recordId;
    const [errorMessage, setErrorMessage] = useState('');    
    const [form] = Form.useForm(); // Хук для получения доступа к объекту формы

    useEffect(() => {        
        if (recordId) {            
            getRole(recordId)
                .then(data => {
                    // Обновляем значения полей формы
                    form.setFieldsValue({
                        name: data.name,
                        id: data.id
                    });
                })
                .catch(error => {
                    setErrorMessage(error.message);
                });
        }
    }, [recordId]);

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleFormSubmit = async (values) => {
        try {
            const id = recordId === null ? "0" : recordId;
            const data = { ...values, id: id };
            await editRole(data);
            navigate("/role");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };    
    return (        
        <Content>
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="form-group">
                        {
                            <h3 style={{textAlign: "left"}}>
                                {recordId ? ("Редактирование"): ("Добавление новой роли")}
                            </h3>                                    
                        }
                        <hr/>
                    </div>
                    <Row justify="center" align="middle">
                        <div className="col-6 mt-4">
                            <Form
                                form={form}
                                name="edit_role"
                                onFinish={handleFormSubmit}
                                onFinishFailed={onFinishFailed}
                            >
                                {errorMessage && (
                                    <Alert message={errorMessage} type="error" showIcon
                                           style={{marginBottom: '16px'}}/>
                                )}
                                <Row gutter={[16, 16]}>
                                    <Col span={24}>
                                        <Form.Item name="id" hidden>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Наименование"
                                            name="name"
                                            style={{marginBottom: 0}}
                                            rules={[{required: true, message: 'Введите наименование роли'}]}
                                        >
                                            <Input.TextArea style={{width: '100%'}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item style={{marginBottom: 0}}>
                                            <Row justify="end">
                                                <Col>
                                                    <Button type="primary" htmlType="submit">
                                                        Сохранить
                                                    </Button>
                                                </Col>                                                        
                                            </Row>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Row>
                </div>
            </div>
        </Content>           
    );
};

export default RoleForm;
