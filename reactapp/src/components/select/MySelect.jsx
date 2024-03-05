import React from 'react';
import { Select } from 'antd';
import "./Style.css"

const { Option } = Select;

const MySelect = ({ options, value, onChange }) => {
    return (
        <Select
            showSearch
            className={"customSelect"}
            value={value}
            onChange={(selectedValue, selectedOption) => onChange(selectedValue, selectedOption)}            
            optionLabelProp="label"
            >           
            {options.map(option =>
                <Option key={option.value} value={option.value} label={option.name}>
                    {option.name}
                </Option>)}
        </Select>
    );
};

export default MySelect;