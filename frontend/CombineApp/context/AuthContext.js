import React, { createContext, useState, useContext } from 'react';
import authStorage from '../auth/storage';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      // Backend'deki login endpoint'inize göre URL'i düzenleyin
      const response = await apiClient.post('/auth/login', { email, password });
      console.log("Login response:", response.data);
      
      if (response.data.token) {
        setToken(response.data.token);
        // Token'ı axios'un default header'larına ekle
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        // Token'ı cihazda sakla
        await authStorage.storeToken(response.data.token);
        // Kullanıcı bilgisini de state'e atayabilirsiniz (isteğe bağlı)
        // setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    // axios header'larından token'ı kaldır
    delete apiClient.defaults.headers.common['Authorization'];
    await authStorage.removeToken();
  };

  const restoreToken = async () => {
    const storedToken = await authStorage.getToken();
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, restoreToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);