// src/components/Layout/Header.jsx

import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Import useLocation
import { Navbar, Container } from "react-bootstrap";
import { FaBook } from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext';
import styles from './Header.module.css'; // Tạo file CSS này để style cho đẹp

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // 2. Lấy thông tin về URL hiện tại

  // 3. Kiểm tra xem có phải trang admin không
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 4. Dựa vào isAdminPage để quyết định hiển thị header nào
  if (isAdminPage) {
    // === GIAO DIỆN HEADER CỦA ADMIN ===
    return (
      <Navbar bg="primary" variant="dark" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/admin" className="d-flex align-items-center">
            <FaBook className="me-2" size={24} />
            <span className="fw-bold">Hệ Thống Quản Lý Thư Viện - GROUP 7</span>
          </Navbar.Brand>
          <Navbar.Text className="text-white">
            Xin chào, Quản trị viên
          </Navbar.Text>
        </Container>
      </Navbar>
    );
  } else {
    // === GIAO DIỆN HEADER CỦA USER ===
    return (
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>Hệ Thống Quản Lý Thư Viện - GROUP 7</Link>
        <div className={styles.userActions}>
          {user ? (
            // Khi đã đăng nhập
            <>
              <span className={styles.welcomeText}>Xin chào, {user.name}</span>
              <Link to="/profile" className={styles.navLink}>Hồ sơ</Link>
              <button onClick={handleLogout} className={styles.logoutButton}>Đăng xuất</button>
            </>
          ) : (
            // Khi chưa đăng nhập
            <>
              <Link to="/register" className={styles.navLink}>Đăng ký</Link>
              <Link to="/login" className={styles.navLink}>Đăng nhập</Link>
            </>
          )}
        </div>
      </header>
    );
  }
};

export default Header;