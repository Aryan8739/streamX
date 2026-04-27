import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await apiClient.get('/users/current-user');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await apiClient.post('/users/login', credentials);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await apiClient.post('/users/logout');
    setUser(null);
  };

  const register = async (formData) => {
    const response = await apiClient.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  const sendOTP = async (email) => {
    const response = await apiClient.post('/users/send-otp', { email });
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, sendOTP, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
