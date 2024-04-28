import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Row, Col, Alert } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";

const UserForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const recordId = location.state && location.state.recordId;
    const [errorMessage, setErrorMessage] = useState('');
    const [form] = Form.useForm();


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return (
        <>
        </>
    );
};

export default UserForm;