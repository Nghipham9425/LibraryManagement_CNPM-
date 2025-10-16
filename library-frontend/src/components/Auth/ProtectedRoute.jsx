// src/components/Auth/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  // Nếu có token (đã đăng nhập), hiển thị trang con (Profile).
  // Nếu không, chuyển hướng người dùng về trang đăng nhập.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;  