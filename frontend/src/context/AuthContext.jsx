import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('elora_user');
      const token = localStorage.getItem('elora_token');

      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
          // Refresh profile in background to keep data fresh
          const { data } = await api.get('/auth/profile');
          setUser(data);
          localStorage.setItem('elora_user', JSON.stringify(data));
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          localStorage.removeItem('elora_user');
          localStorage.removeItem('elora_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('elora_token', data.token);
      localStorage.setItem('elora_user', JSON.stringify(data));
      success(`Welcome back, ${data.name}!`);
      return data;
    } catch (err) {
      toastError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      setUser(data);
      localStorage.setItem('elora_token', data.token);
      localStorage.setItem('elora_user', JSON.stringify(data));
      success('Welcome to ÉLORA BEAUTY! Account created.');
      return data;
    } catch (err) {
      toastError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('elora_user');
    localStorage.removeItem('elora_token');
    setUser(null);
    success('You have signed out.');
  };

  const updateProfile = async (userData) => {
    try {
      const { data } = await api.put('/auth/profile', userData);
      setUser(data);
      localStorage.setItem('elora_user', JSON.stringify(data));
      if (data.token) {
        localStorage.setItem('elora_token', data.token);
      }
      success('Profile successfully updated.');
      return data;
    } catch (err) {
      toastError(err.message || 'Profile update failed');
      throw err;
    }
  };

  // Address helpers
  const addAddress = async (addressData) => {
    try {
      const { data } = await api.post('/auth/addresses', addressData);
      setUser((prev) => ({ ...prev, addresses: data }));
      success('Delivery address added.');
      return data;
    } catch (err) {
      toastError(err.message || 'Failed to add address');
      throw err;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const { data } = await api.delete(`/auth/addresses/${addressId}`);
      setUser((prev) => ({ ...prev, addresses: data }));
      success('Address removed.');
      return data;
    } catch (err) {
      toastError(err.message || 'Failed to delete address');
      throw err;
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const { data } = await api.put(`/auth/addresses/${addressId}`, { isDefault: true });
      setUser((prev) => ({ ...prev, addresses: data }));
      success('Default delivery address updated.');
      return data;
    } catch (err) {
      toastError(err.message || 'Failed to set default address');
      throw err;
    }
  };

  // Demo Login Quick-Helpers
  const loginDemoAdmin = async () => {
    return login('admin@elora.com', 'admin123');
  };

  const loginDemoUser = async () => {
    return login('user@elora.com', 'user123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        loginDemoAdmin,
        loginDemoUser,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
