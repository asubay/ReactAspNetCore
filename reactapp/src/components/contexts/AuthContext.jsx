import React, {createContext, useState, useContext, useEffect, useRef, useCallback} from 'react';
import {fetchLogin, getAuthenticationInfo} from "@/services/api.js";
import { useNavigate } from "react-router-dom";

// Создание контекста аутентификации
const AuthContext = createContext(null); 

function useNavigateRef() {
    const navigate = useNavigate();
    const navRef = useRef(navigate);

    useEffect(() => {
        navRef.current = navigate;
    }, [navigate]);

    return navRef;
}


// Создание провайдера аутентификации
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);    
    const navigateRef = useNavigateRef();

    useEffect(() => {
        console.log('mount');
        return () => {
            console.log('unmount');
        }
    }, []);
    
    //проверка актуальности сессии, в случая успеха возвращает инфо о пользователе
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await getAuthenticationInfo();                
                if (response.ok) {
                    setIsAuthenticated(true);
                    setUser(response.data); // сервер возвращает информацию о пользователе
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        };
        console.log('AuthProvider useEffect');

        checkAuthentication();
    }, []);

    // Функция для входа
    const login = useCallback(async (data) =>  {
        try {
            const response = await fetchLogin(data);
            setIsAuthenticated(true);
            setUser(response);
            navigateRef.current("/");
        } catch (error) {            
            throw error;
        }
    }, [navigateRef]);

    // Функция для выхода
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null); 
    };

    const contextValue = {
        isAuthenticated,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={ contextValue }>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);