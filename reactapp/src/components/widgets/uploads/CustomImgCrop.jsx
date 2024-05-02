import React, { useState } from 'react';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import {uploadFile} from "@/services/api.js";

const CustomImgCrop = ({ onChange, maxCount }) => {
    const [fileList, setFileList] = useState([]);

    const handleOnChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        onChange(newFileList); // передаем новый список файлов наверх к родительской форме
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    return (
        <ImgCrop>
            <Upload    
                //action={uploadFile}    
                listType="picture-card"
                fileList={fileList}
                onChange={handleOnChange}
                onPreview={onPreview}
                maxCount={maxCount} // указываем максимальное количество загружаемых файлов
            >
                {fileList.length === 0 && '+ аватар'}
            </Upload>
        </ImgCrop>
    );
};

export default CustomImgCrop;
