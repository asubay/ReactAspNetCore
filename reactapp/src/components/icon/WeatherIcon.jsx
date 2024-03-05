import React from 'react';
import { StarFilled, SunFilled } from '@ant-design/icons';

const WeatherIcon = ({ temperature}) => {
    const isBelowZero = temperature < 0;
    const iconColor = temperature > 0 ? 'yellow' : '#ACD0EF'
    
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {isBelowZero ? (
                <StarFilled style={{ fontSize: '36px', marginRight: '8px', color: iconColor }} />
            ) : (
                <SunFilled style={{ fontSize: '36px', marginRight: '8px', color: iconColor }} />
            )}
            <span style={{ fontSize: '36px',  marginBottom: '10px', marginTop: '6px' }}>{temperature}°C</span>
        </div>    
    );
};

export default WeatherIcon;