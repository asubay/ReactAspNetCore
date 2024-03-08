import React from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;

const FooterSection = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            Created by <a href="https://www.linkedin.com/in/yerkezhan-assubayeva-6a02641aa/">asubay</a> ©{new Date().getFullYear()}
        </Footer>
    );
};

export default FooterSection;