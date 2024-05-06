import React, { useState } from 'react';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from "axios";

const API_BASE_URL = "/api/";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const CustomImgCrop = ({ onChange, maxCount, caption }) => {
    const [fileList, setFileList] = useState([]);

    const handleOnChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (JSON.stringify(fileList) !== JSON.stringify(newFileList)) {
            onChange(newFileList); 
        }
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

    const customRequest = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/user/UploadFile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            onSuccess(response.data);
            message.success('Файл успешно загружен');
        } catch (error) {
            onError(error);
            message.error('Ошибка при загрузке файла');
        }
    };

    return (
        <ImgCrop>
            <Upload
                customRequest={customRequest}  
                listType="picture-card"
                fileList={fileList}
                onChange={handleOnChange}
                onPreview={onPreview}
                maxCount={maxCount} // указываем максимальное количество загружаемых файлов
            >
                {fileList.length === 0 && caption}
            </Upload>
        </ImgCrop>
    );
};

export default CustomImgCrop;
