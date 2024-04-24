import React, { createContext, useState, useContext, useEffect } from 'react';
import {fetchLogin} from "@/services/api.js";
import { useNavigate } from "react-router-dom";

// Создание контекста аутентификации
const AuthContext = createContext(); 

// Создание провайдера аутентификации
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("site"));
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("site");
        if (token) {
            setIsAuthenticated(true);
            // Здесь допиши выполнить запрос к серверу для получения данных о пользователе           
        }
    }, []);

    // Функция для входа
    const login = async (data) =>  {
        try {
            const response = await fetchLogin(data);
            setIsAuthenticated(true);
            setUser(response);
            setToken(response.token);
            localStorage.setItem("site", response.token);
            navigate("/");
        } catch (error) {            
            throw error;
        }
    };

    // Функция для выхода
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setToken("");
        localStorage.removeItem("site");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout, user, login, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);