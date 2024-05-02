import React, { useState, useEffect } from 'react';
import CustomTable from "@/components/widgets/tables/CustomTable.jsx";
import { useNavigate } from "react-router-dom";
import { deleteUser, fetchGetUsers } from "@/services/api.js";
import { Layout, Spin, Space, Button, Tooltip, message  } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Content } = Layout;

const UserListForm = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    useEffect(()=>
    {
        setLoading(true);
        const fetchUsersList = async () => {
            try {
                const data = await fetchGetUsers();
                setUsers(data);

            } catch (error) {
                console.error('Error fetching get users:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUsersList();
    }, [deleteSuccess])

    const handleEdit = async (record) => {
        try {
            navigate(`/user/edit/${record.id}`, { state: { recordId: record.id } });
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async (key) => {
        const result = await deleteUser(key);
        if (result === "Succeeded")
        {
            message.success('Пользователь успешно удален');
            setDeleteSuccess(!deleteSuccess);
        }           
    };

    const handleAdd = () => {
        navigate("/user/edit/0");
    };

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            align: 'left',
        },
        {
            title: 'Логин',
            dataIndex: 'login',
            key: 'login',
            align: 'Left',
        },        
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'Left',
        },
        {
            title: 'Номер телефона',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            align: 'Left',
        },
        {
            title: 'Действия',
            width: 150,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Редактировать">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];
    if (loading) {
        return (
            <Spin tip="Loading" size="large" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                <div />
            </Spin>
        );
    }
    
    return (                   
        <Content className="listContentStyle">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="form-group">
                        <h3 style={{textAlign: "left"}}>Пользователи</h3>
                        <hr/>
                    </div>
                    <div className="col-11 text-right mb-3">
                        <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                            Добавить
                        </Button>
                    </div>
                    <CustomTable columns={columns} dataSource={users}/>
                </div>
            </div>
        </Content>  
    );
};

export default UserListForm;