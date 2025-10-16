// src/user/pages/CategoryPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookAPI } from '../../apis'; // Import API cho sách
import BookCard from '../../components/Books/BookCard.jsx';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
  const { categoryName } = useParams(); // Lấy tên thể loại từ URL
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        setLoading(true);
        // Gọi API tìm kiếm sách với tham số là tên thể loại
        const data = await bookAPI.search({ genre: categoryName });
        setBooks(data);
      } catch (error) {
        console.error(`Lỗi khi tải sách cho thể loại ${categoryName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi API khi có categoryName
    if (categoryName) {
      fetchBooksByCategory();
    }
  }, [categoryName]); // useEffect sẽ chạy lại mỗi khi categoryName thay đổi

  if (loading) {
    return <div className={styles.container}>Đang tải...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thể loại: {categoryName}</h1>
      {books.length > 0 ? (
        <div className={styles.bookList}>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p>Không có sách nào trong thể loại này.</p>
      )}
    </div>
  );
};

export default CategoryPage;