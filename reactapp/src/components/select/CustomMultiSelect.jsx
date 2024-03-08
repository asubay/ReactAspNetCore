import React from 'react';
import { Select } from 'antd';

const CustomMultiSelect = ({placeholder, handleChange, options}) => {
    return (
        <Select
            mode="multiple"            
            placeholder={placeholder}            
            onChange={handleChange}
            className={"customMultiselect"}
            options={options}
        />
    );
};

export default CustomMultiSelect;