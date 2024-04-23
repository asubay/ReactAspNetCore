import React from 'react';
import { Carousel } from 'antd';
import "@/components/widgets/styles/Style.css"

const TopCarousel = () => {
    return (
        <Carousel>           
            <div>
                <div className='slide-item slide-item-1'></div>
            </div>
            <div>
                <div className='slide-item slide-item-2'></div>
            </div>
            <div>
                <div className='slide-item slide-item-3'></div>
            </div>
        </Carousel>
    );
};

export default TopCarousel;