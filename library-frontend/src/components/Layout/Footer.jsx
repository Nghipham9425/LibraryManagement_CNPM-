import { Container } from "react-bootstrap"
import { Link } from 'react-router-dom'; // 1. Import Link
import styles from './Footer.module.css'; // 2. Import CSS (sẽ tạo ở bước sau)

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        {/* 3. Thêm link "Thông tin thư viện" vào đây */}
        <Link to="/library-info" className={styles.link}>Thông tin thư viện</Link>
      </div>
      <div className={styles.copyright}>
        © 2025 Hệ Thống Quản Lý Thư Viện, Bản quyền thuộc về Nhóm 7
      </div>
    </footer>
  );
};

export default Footer
