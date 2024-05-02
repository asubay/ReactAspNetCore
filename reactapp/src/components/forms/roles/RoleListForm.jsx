import React, { useState, useEffect } from 'react';
import {deleteRole, fetchGetRoles} from "@/services/api.js";
import { Layout, Spin, Space, Button, Tooltip, message } from 'antd';
import CustomTable from "@/components/widgets/tables/CustomTable.jsx";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const RoleListForm = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
        
    const handleEdit = async (record) => {
        try {          
            navigate(`/role/edit/${record.id}`, { state: { recordId: record.id } });
        } catch (error) {
            console.log(error.message);            
        }        
    };

    const handleDelete = async (key) => {
        const result = await deleteRole(key);
        if (result === "Succeeded")
        {
            message.success('Роль успешно удалена');
            setDeleteSuccess(!deleteSuccess);
        }
    };

    const handleAdd = () => {
        navigate("/role/edit/0");
    };
    
    useEffect(()=>
    {
        setLoading(true);
        const fetchRolesList = async () => {
            try {
                const data = await fetchGetRoles();                
                setRoles(data);

            } catch (error) {
                console.error('Error fetching get roles:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRolesList();

    }, [deleteSuccess])

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            align: 'left',
            width: 500,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            align: 'Left',
        },
        {
            title: 'Действия',
            width: 50,
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
                        <h3 style={{textAlign: "left"}}>Роли</h3>
                        <hr/>
                    </div>

                    <div className="col-11 text-right mb-3">
                        <Button type="primary" icon={<PlusOutlined/>} onClick={handleAdd}>
                            Добавить
                        </Button>
                    </div>

                    <CustomTable columns={columns} dataSource={roles}/>
                </div>
            </div>
        </Content>  
    );
};

export default RoleListForm;