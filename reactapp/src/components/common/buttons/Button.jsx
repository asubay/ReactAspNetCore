import React from 'react';
import "@/components/common/style/Style.css"

const MyButton = (props) => {
    return (
        <button className="customBtn" onClick={props.onClick}>{props.text}</button>
    );
};

export default MyButton;