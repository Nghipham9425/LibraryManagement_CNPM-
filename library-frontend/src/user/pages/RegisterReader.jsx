// src/user/pages/RegisterReader.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../apis'; // Import API
import { toast } from 'react-toastify'; // Import thư viện thông báo
import styles from './RegisterReader.module.css';

const RegisterReader = () => {
  // State để lưu trữ toàn bộ dữ liệu của form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // Hàm được gọi mỗi khi người dùng gõ vào ô input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi người dùng nhấn nút "Đăng ký"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt tải lại trang
    
    // (Tùy chọn) Bạn có thể thêm logic kiểm tra mật khẩu ở đây
    
    try {
      // Gọi API đăng ký và gửi dữ liệu từ form
      await authAPI.register(formData);
      
      // Hiển thị thông báo thành công
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // Chuyển hướng người dùng đến trang đăng nhập
      navigate('/login');
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Hiển thị thông báo lỗi từ backend (nếu có) hoặc một lỗi chung
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h1 className={styles.title}>Đăng ký tài khoản độc giả</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>Họ và Tên</label>
          <input 
            type="text" 
            id="name" 
            name="name" // Quan trọng: name phải khớp với key trong state
            className={styles.input} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className={styles.input} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Mật khẩu</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            className={styles.input} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className={styles.button}>Đăng ký</button>
      </form>
      <p className={styles.loginLink}>
        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
      </p>
    </div>
  );
};

export default RegisterReader;