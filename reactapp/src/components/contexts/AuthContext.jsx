import React, {createContext, useState, useContext, useEffect, useRef, useCallback} from 'react';
import {fetchLogin, fetchLogout, getAuthenticationInfo} from "@/services/api.js";
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
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);    
    const navigateRef = useNavigateRef();    
    
    //проверка актуальности сессии, в случая успеха возвращает инфо о пользователе
    useEffect(() => {
        const checkAuthentication = async () => {
            
            try {
                const response = await getAuthenticationInfo();  
                if (response) {
                    setIsAuthenticated(true);
                    if (response.isAdmin)
                    {                        
                        setIsAdmin(true);
                    }                    
                    setUser(response);
                }
                
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                setIsAdmin(false);
                console.error('Error checking authentication:', error);
            }
        };        

        checkAuthentication();
    }, []);

    // Функция для входа
    const login = useCallback(async (data) =>  {
        try {
            const response = await fetchLogin(data);
            setIsAuthenticated(true);
            setUser(response);
            if (response.isAdmin)
            {
                setIsAdmin(true);
            }
            navigateRef.current("/");
        } catch (error) {            
            throw error;
        }
    }, [navigateRef]);

    // Функция для выхода
    const logout = async () => {
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        await fetchLogout();
        navigateRef.current("/login");
    };

    const contextValue = {
        isAuthenticated,
        isAdmin,
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
export default AuthProvider;
export const useAuth = () => useContext(AuthContext);