// src/context/AuthContext.jsx

import React, { createContext, useState } from 'react';

// 1. Tạo Context object
export const AuthContext = createContext();

// 2. Tạo component Provider
export const AuthProvider = ({ children }) => {
  // State để lưu thông tin người dùng (vd: { name: '...', email: '...' })
  const [user, setUser] = useState(null);
  
  // State để lưu token xác thực, lấy từ bộ nhớ cục bộ của trình duyệt
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Hàm để xử lý khi người dùng đăng nhập thành công
  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken); // Lưu token vào localStorage
    setToken(userToken); // Cập nhật token trong state
    setUser(userData); // Cập nhật thông tin người dùng trong state
  };

  // Hàm để xử lý khi người dùng đăng xuất
  const logout = () => {
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
    setToken(null); // Xóa token khỏi state
    setUser(null); // Xóa thông tin người dùng khỏi state
  };

  // Cung cấp các giá trị và hàm cho các component con
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};