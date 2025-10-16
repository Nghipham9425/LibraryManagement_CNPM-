// src/user/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authAPI } from '../../apis';
import { toast } from 'react-toastify';
import styles from './Login.module.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Giả sử API trả về đối tượng có dạng: { user: {...}, token: '...' }
      const data = await authAPI.login(credentials);
      login(data.user, data.token); // Lưu vào Context để toàn bộ ứng dụng biết
      toast.success('Đăng nhập thành công!');
      navigate('/'); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input type="email" id="email" name="email" className={styles.input} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Mật khẩu</label>
          <input type="password" id="password" name="password" className={styles.input} onChange={handleChange} required />
        </div>
        <button type="submit" className={styles.button}>Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;