// src/user/pages/LibraryInfo.jsx

import React from 'react';
import styles from './LibraryInfo.module.css';

const LibraryInfo = () => {
  return (
    <div className={styles.infoContainer}>
      <h1 className={styles.title}>Thông Tin Thư Viện - Nhóm 7</h1>
      
      <p className={styles.text}>
        Chào mừng bạn đến với hệ thống quản lý thư viện trực tuyến của chúng tôi. 
        Đây là nơi bạn có thể dễ dàng tìm kiếm, tra cứu và quản lý việc mượn trả sách.
      </p>

      <h2 className={styles.sectionTitle}>Giờ Mở Cửa</h2>
      <p className={styles.text}>
        - Thứ Hai - Thứ Sáu: 8:00 AM - 8:00 PM
        <br />
        - Thứ Bảy: 9:00 AM - 5:00 PM
        <br />
        - Chủ Nhật: Đóng cửa
      </p>

      <h2 className={styles.sectionTitle}>Nội Quy Thư Viện</h2>
      <p className={styles.text}>
        1. Vui lòng giữ im lặng và trật tự chung.
        <br />
        2. Không mang đồ ăn, thức uống vào khu vực đọc sách.
        <br />
        3. Sách cần được trả đúng hạn để tránh phí phạt.
      </p>
    </div>
  );
};

export default LibraryInfo;