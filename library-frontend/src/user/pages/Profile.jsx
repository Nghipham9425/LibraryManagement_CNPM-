// src/user/pages/Profile.jsx

import React from 'react';
import styles from './Profile.module.css';

// Dữ liệu mẫu, sau này sẽ lấy từ thông tin người dùng đăng nhập
const userData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  memberId: 'DG00123',
};

const Profile = () => {
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>Thông Tin Cá Nhân</h1>
      
      <div className={styles.infoGroup}>
        <label className={styles.label}>Họ và Tên</label>
        <div className={styles.value}>{userData.name}</div>
      </div>
      
      <div className={styles.infoGroup}>
        <label className={styles.label}>Email</label>
        <div className={styles.value}>{userData.email}</div>
      </div>
      
      <div className={styles.infoGroup}>
        <label className={styles.label}>Mã độc giả</label>
        <div className={styles.value}>{userData.memberId}</div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={`${styles.button} ${styles.saveButton}`}>Cập nhật thông tin</button>
        <button className={`${styles.button} ${styles.logoutButton}`}>Đăng xuất</button>
      </div>
    </div>
  );
};

export default Profile;