// src/user/pages/BookCategories.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { genreAPI } from '../../apis'; // Import API cho thể loại
import styles from './BookCategories.module.css';

const BookCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await genreAPI.getAll(); // Gọi API để lấy danh sách thể loại
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className={styles.container}>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh Mục Sách</h1>
      <div className={styles.grid}>
        {categories.length > 0 ? (
          categories.map((category) => (
            // Link đến trang chi tiết của từng thể loại
            <Link to={`/categories/${category.name}`} key={category.id} className={styles.card}>
              {category.name}
            </Link>
          ))
        ) : (
          <p>Không có thể loại nào để hiển thị.</p>
        )}
      </div>
    </div>
  );
};

export default BookCategories;