import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../service/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tự động load user nếu có token + user trong localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Đăng ký
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại',
        error: error.response?.data
      };
    }
  };

  // Đăng nhập
// Đăng nhập
const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    const { accessToken, ...userData } = response.data;

    // Lưu token + user vào localStorage
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // 👇 Gửi thông tin thiết bị sau khi login
    try {
      const deviceName = navigator.userAgent || 'Unknown Device';
      await axiosInstance.post('/api/device', {
        user_id: userData.id,
        device_name: deviceName
      });
      console.log("✅ Đã ghi nhận thiết bị");
    } catch (deviceError) {
      console.error("❌ Ghi nhận thiết bị thất bại:", deviceError);
    }

    return { success: true, user: userData };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Đăng nhập thất bại',
      error: error.response?.data
    };
  }
};
const logout = async () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;
  const deviceName = navigator.userAgent;

  if (userId) {
    try {
      await axiosInstance.delete(`/api/device/${userId}`, {
        data: { device_name: deviceName },
      });
      console.log('✅ Đã xóa thiết bị khi logout');
    } catch (err) {
      console.error('❌ Lỗi khi xóa thiết bị:', err.response?.data || err.message);
    }
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
};


  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.type === '1',
    isUser: user?.type === '1' || user?.type === '2',
    isPay: user?.type === '2' || user?.type === '3',
    isBanned: user?.type === '4'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
