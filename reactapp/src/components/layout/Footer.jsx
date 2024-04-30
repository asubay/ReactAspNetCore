import React from 'react';
import { Layout } from 'antd';
import {Link} from "react-router-dom";
const { Footer } = Layout;

const FooterSection = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            Created by <Link to="https://www.linkedin.com/in/yerkezhan-assubayeva-6a02641aa/">asubay</Link> ©{new Date().getFullYear()}
        </Footer>
    );
};

export default FooterSection;