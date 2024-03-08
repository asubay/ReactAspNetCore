import React from 'react';
import { Table } from 'antd';

const AccidentTable = ({accidents}) => {
    
    const columns = [
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
        },
        {
            title: 'Кол-во пострадавших',
            dataIndex: 'injuries',
            key: 'injuries',
            align: 'center',
        },
        {
            title: 'Транспорт',
            dataIndex: 'vehicles',
            key: 'vehicles',           
        },
        {
            title: 'Время суток',
            dataIndex: 'light',
            key: 'light',            
        },
        {
            title: 'Правонарушающий',
            dataIndex: 'offender',
            key: 'offender',           
        },
        {
            title: 'Нарушение',
            dataIndex: 'offence',
            key: 'offence',           
        },
        {
            title: 'Состояние водителя',
            dataIndex: 'impairment',
            key: 'impairment',           
        }, 
        {
            title: 'Местность',
            dataIndex: 'area_type',
            key: 'area_type',            
        },
        {
            title: 'Тип ДТП',
            dataIndex: 'kind',
            key: 'kind',            
        },
    ]

    const paginationOptions = {
        pageSize: 10,
    };
    
    return (
        <div>
            <Table
                dataSource={accidents}
                columns={columns}
                pagination={paginationOptions}
                bordered
                rowKey="id"
            />
        </div>
    );
};

export default AccidentTable;