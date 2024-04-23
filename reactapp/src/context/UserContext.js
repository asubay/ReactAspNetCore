import React, { createContext, useState, useContext } from 'react';

// Создание контекста пользователя
const UserContext = createContext();

// Поставщик контекста пользователя
const UserProvider = ({ children }) => {    
    const [user, setUser] = useState(null);
   
    const login = (userData) => {
        setUser(userData);
    };
   
    const logout = () => {
        setUser(null);
    };
   
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Функция-хук для использования контекста пользователя в компонентах
const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export { UserProvider, useUser };