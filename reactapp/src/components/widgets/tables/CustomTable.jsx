import React from 'react';
import { Table } from 'antd';

const CustomTable = ({ columns, dataSource }) => {
    const paginationOptions = {
        pageSize: 10,
    };

    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={paginationOptions}
                bordered
                rowKey="id"
            />
        </>
    );
};

export default CustomTable;
