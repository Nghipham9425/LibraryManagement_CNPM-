// src/user/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../../components/Books/BookCard';
import styles from './Home.module.css';
import { bookAPI } from '../../apis'; // <-- 1. Sửa lại cách import

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        // 2. Sửa lại cách gọi hàm API
        // Giả sử backend có endpoint /books/featured, nếu không có, dùng getAll
        // const data = await bookAPI.getFeatured(); 
        const data = await bookAPI.getAll(); // Tạm thời dùng getAll
        
        setBooks(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  if (loading) {
    return (
      <div className={styles.homeContainer}>
        <h2 className={styles.sectionTitle}>Đang tải sách...</h2>
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.welcomeTitle}>Chào mừng đến với Thư viện</h1>

      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li><Link to="/search" className={styles.navLink}>Tìm kiếm sách</Link></li>
          <li><Link to="/categories" className={styles.navLink}>Danh mục sách</Link></li>
         
        </ul>
      </nav>

      <div className={styles.featuredSection}>
        <h2 className={styles.sectionTitle}>Sách Nổi Bật</h2>
        <div className={styles.bookList}>
          {books.length > 0 ? (
            books.map(book => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <p>Không có sách nào để hiển thị.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;