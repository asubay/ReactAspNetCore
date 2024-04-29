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
        const response = await api.get(`/accident/GetAccidentData`);
        return response.data;
    } catch (error) {
        console.error('Error fetch Accident:', error);
        throw error;
    }
};

export const fetchLogin = async (data) =>  {    
    try {
        const response = await axios.post('/auth/login', {
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
        const response = await api.get(`/role/GetRoleList`);        
        return response.data;
    } catch (error) {
        console.error('Error fetch Accident:', error);
        throw error;
    }
};

export const editRole = async (data) =>  {
    try {        
        const response = await axios.post('/role/EditRole', {
            id: data.id,
            name: data.name,
        });
        return response.data;
    } catch (error) {        
        throw new Error('Ошибка при изменений данных');
    }
};

export const getRole = async (id) => {
    try {
        const response = await api.get(`/role/GetRole`, {
            params: {
                id: id
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error while getting role:', error);
        throw error;
    }
};

export const fetchGetUsers= async () => {
    try {
        const response = await api.get(`/user/GetUsersList`);
        return response.data;
    } catch (error) {
        console.error('Error while fetching user list:', error);
        throw error;
    }
};

export const saveUserData = async (userData) => {
    
    try {
        const response = await axios.post('/user/EditUser', {
            id: userData.id,
            username: userData.username,           
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
            isActive: userData.isActive,
            role: userData.role
        });       
        return response.data; 
    } catch (error) {
        console.error('Error while saving user data:', error);
        throw error;
    }
};

export const getUser = async (id) => {
    try {
        const response = await api.get(`/user/GetUser`, {
            params: {
                id: id
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error while getting user:', error);
        throw error;
    }
};