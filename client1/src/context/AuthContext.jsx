// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
          setIsAuthenticated(true);
          setIsAdmin(res.data.data.role === 'admin');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        const { token, data: userData } = res.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');

        return { success: true };
      } else {
        return {
          success: false,
          message: res.data.message || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      if (res.data.success) {
        const { token, data: newUser } = res.data;

        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(newUser);
        setIsAuthenticated(true);
        setIsAdmin(newUser.role === 'admin');

        return { success: true };
      } else {
        return {
          success: false,
          message: res.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const updateUserBalance = (newBalance) => {
    setUser(prev => ({
      ...prev,
      walletBalance: newBalance
    }));
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateUserBalance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};