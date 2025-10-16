// src/user/pages/BookDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookAPI } from '../../apis';
import styles from './BookDetails.module.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const data = await bookAPI.getById(id);
        setBook(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return <div className={styles.container}>Đang tải...</div>;
  }

  if (!book) {
    return <div className={styles.container}>Không tìm thấy thông tin sách.</div>;
  }

  // Cung cấp một ảnh dự phòng nếu imageUrl không có hoặc bị lỗi
  const imageUrl = book.imageUrl || 'https://via.placeholder.com/400x600/f2f2f2/333?text=No+Image';

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={book.title} className={styles.coverImage} />
        </div>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{book.title}</h1>
          
          {/* ✅ SỬA LỖI TRIỆT ĐỂ Ở ĐÂY BẰNG OPTIONAL CHAINING */}
          <p className={styles.author}>bởi {book.author?.name || 'Chưa rõ tác giả'}</p>
          <p className={styles.genre}><strong>Thể loại:</strong> {book.genre?.name || 'Chưa phân loại'}</p>
          
          <hr />
          <h3 className={styles.sectionTitle}>Mô tả</h3>
          <p className={styles.description}>{book.description || 'Chưa có mô tả cho cuốn sách này.'}</p>
          <button className={styles.borrowButton}>Mượn Sách</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;