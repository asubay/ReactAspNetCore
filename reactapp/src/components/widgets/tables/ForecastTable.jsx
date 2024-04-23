import React from 'react';
import { Table } from 'antd';

const ForecastTable = ({ forecasts }) => {
    
    const columns = [
        {
            title: 'Дата и время',
            dataIndex: 'dateTime',
            key: 'dateTime',
            align: 'center',
        },
        {
            title: 'Температура, С',
            dataIndex: 'temperature',
            key: 'temperature',
            align: 'center',
        },
        {
            title: 'Ощущается как, С',
            dataIndex: 'feelsLike',
            key: 'feelsLike',
            align: 'center',
        },
        {
            title: 'Давление, Па',
            dataIndex: 'pressure',
            key: 'pressure',
            align: 'center',
        },
        {
            title: 'Влажность, %',
            dataIndex: 'humidity',
            key: 'humidity',
            align: 'center',
        },
        {
            title: 'Скорость ветра, м/с',
            dataIndex: 'windSpeed',
            key: 'windSpeed',
            align: 'center',
        },
        {
            title: 'Направление ветра',
            dataIndex: 'windDeg',
            key: 'windDeg',
            align: 'center',
        },
    ];

    const paginationOptions = {
        pageSize: 10, 
    };
    
    return (
        <>
            <Table
                dataSource={forecasts}
                columns={columns}
                pagination={paginationOptions}
                bordered
                rowKey="dateTime" 
            />
        </>        
    );
};

export default ForecastTable;