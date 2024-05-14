import React, { useEffect, useState, useCallback } from 'react';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import { fetchGetUserPhoto } from '@/services/api.js';

const API_BASE_URL = '/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const CustomImgCrop = ({ onChange, maxCount, caption, id }) => {
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchPhoto = async () => {
            const photoUrl = await fetchGetUserPhoto(id);
            if (photoUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'user_photo.jpg',
                        status: 'done',
                        url: photoUrl,
                    },
                ]);
            }
        };
        fetchPhoto();
    }, [id]);

    const handleOnChange = useCallback(({ fileList: newFileList }) => {       
        setFileList(newFileList);
        onChange(newFileList);
    }, [onChange]);

    const onPreview = useCallback(async (file) => {
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
    }, []);

    const handleOnRemove = useCallback(async () => {
        try {
            await api.delete(`/user/DeletePhoto/${id}`);
            message.success('Файл успешно удален');
        } catch (error) {
            message.error('Ошибка при удалении файла');
        }
    }, [id]);

    const customRequest = useCallback(async ({ file, onError, onSuccess }) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/user/SavePhoto', formData, {
                params: {
                    userId: id,
                },
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onSuccess();
        } catch (error) {
            onError(error);
            message.error('Ошибка при загрузке файла');
        }
    }, [id]);

    return (
        <ImgCrop>
            <Upload
                customRequest={customRequest}
                listType="picture-card"
                fileList={fileList}
                onChange={handleOnChange}
                onPreview={onPreview}
                maxCount={maxCount}
                onRemove={handleOnRemove}
            >
                {fileList.length === 0 && caption}
            </Upload>
        </ImgCrop>
    );
};

export default CustomImgCrop;
