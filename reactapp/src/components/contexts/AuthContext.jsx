import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from "react";
import {
  fetchLogin,
  fetchLogout,
  getAuthenticationInfo,
} from "@/services/api.js";
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
  const [loading, setLoading] = useState(true);

  //проверка актуальности сессии, в случая успеха возвращает инфо о пользователе
  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      try {
        const response = await getAuthenticationInfo();
        if (response) {
          setIsAuthenticated(true);
          if (response.isAdmin) {
            setIsAdmin(true);
          }
          setUser(response);
        }
      } 
      catch (error) {        
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        navigateRef.current("/login");
      }
      finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Функция для входа
  const login = useCallback(
    async (data) => {
      try {
        const response = await fetchLogin(data);
        setIsAuthenticated(true);
        setUser(response);       
        
        if (response.isAdmin) {
          setIsAdmin(true);
        }
        navigateRef.current("/");
      } catch (error) {
        throw error;
      }
    },
    [navigateRef],
  );

  // Функция для выхода
  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    await fetchLogout();
    navigateRef.current("/login");
  }, [navigateRef]);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    isAdmin,
    user,
    login,
    logout,
    loading,
  }), [isAuthenticated, isAdmin, user, login, logout, loading]);

  return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
  );
};
export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
