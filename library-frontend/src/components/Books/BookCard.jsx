// src/components/Books/BookCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BookCard.module.css'; // Chúng ta sẽ tạo file CSS này ngay sau đây

const BookCard = ({ book }) => {
  return (
    // Link đến trang chi tiết sách khi người dùng click vào
    <Link to={`/book/${book.id}`} className={styles.bookCard}>
      <img src={book.imageUrl} alt={book.title} className={styles.coverImage} />
      <div className={styles.bookInfo}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
      </div>
    </Link>
  );
};

export default BookCard;