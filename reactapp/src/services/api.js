import axios from "axios";

const API_BASE_URL = "/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchForecasts = async (cityId) => {
  try {
    const response = await api.get(`/weatherforecast?cityId=${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching forecasts:", error);
    throw error;
  }
};

export const fetchAccident = async () => {
  try {
    const response = await api.get(`/accident/GetAccidentData`);
    return response.data;
  } catch (error) {
    console.error("Error fetch Accident:", error);
    throw error;
  }
};

export const fetchLogin = async (data) => { 
  try {
    const response = await api.post(`/auth/Login`, {
      userName: data.username,
      password: data.password,
    });
    return response.data;
  } catch (error) {
    console.error("fetch Login error:", error);
    throw new Error("Ошибка авторизации: неверные учетные данные");
  }
};

export const getAuthenticationInfo = async () => {
  
  try {
    const response = await api.get(`/auth/GetCurrentUser`);
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    
    throw error;
  }
};

export const fetchGetRoles = async () => {
  try {
    const response = await api.get(`/role/GetRoleList`);
    return response.data;
  } catch (error) {
    console.error("Error fetch Accident:", error);
    throw error;
  }
};

export const editRole = async (data) => {
  try {
    const response = await api.post("/role/EditRole", {
      id: data.id,
      name: data.name,
    });
    return response.data;
  } catch (error) {
    throw new Error("Ошибка при изменений данных");
  }
};

export const getRole = async (id) => {
  try {
    const response = await api.get(`/role/GetRole`, {
      params: {
        id: id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while getting role:", error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await api.post("/role/DeleteRole", id.toString());
    return response.data;
  } catch (error) {
    console.error("Error while deleting role:", error);
    throw error;
  }
};

export const fetchGetUsers = async () => {
  try {
    const response = await api.get(`/user/GetUsersList`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching user list:", error);
    throw error;
  }
};

export const saveUserData = async (userData) => {
  try {
    const response = await api.post("/user/EditUser", {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      isActive: userData.isActive,
      role: userData.role,
    });
    return response.data;
  } catch (error) {
    console.error("Error while saving user data:", error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`user/GetUser`, {
      params: {
        id: id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while getting user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/user/DeleteUser/${id}`);   
  } catch (error) {
    console.error("Error while deleting user:", error);
    throw error;
  }
};

export const fetchLogout = async () => {
  try {
    await api.post("auth/Logout");
  } catch (error) {
    throw new Error("Ошибка при изменений данных");
  }
};

export const fetchGetUserPhoto = async (userId) => {
  try {
    const response = await api.get(`/user/GetUserPhoto`, {
      params: { userId },
      responseType: 'arraybuffer',
    });

    if (!response.data) {
      throw new Error('No data received');
    }

    const base64 = btoa(
        new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
        )
    );
    const mimeType = response.headers['content-type'];

    return `data:${mimeType};base64,${base64}`;

  } catch (error) {
    console.error("Error fetching photo:", error);
    throw error;
  }
};