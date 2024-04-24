import axios from 'axios';

const API_BASE_URL = 'https://';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const fetchForecasts = async (cityId) => {
    try {
        const response = await api.get(`/weatherforecast?cityId=${cityId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching forecasts:', error);
        throw error;
    }
};

export const fetchAccident = async () => {
    try {
        const response = await api.get(`/accident`);
        return response.data;
    } catch (error) {
        console.error('Error fetch Accident:', error);
        throw error;
    }
};

export const fetchLogin = async (data) =>  {    
    try {
        const response = await axios.post('/api/auth/login', {
            username: data.username,
            password: data.password,
        });
        return response.data;
    } catch (error) {
        console.error('fetch Login error:', error);
        throw new Error('Ошибка авторизации: неверные учетные данные');
    } 
};

export const fetchGetRoles = async () => {
    try {        
        const response = await api.get(`/role/GetRoles`);        
        return response.data;
    } catch (error) {
        console.error('Error fetch Accident:', error);
        throw error;
    }
};