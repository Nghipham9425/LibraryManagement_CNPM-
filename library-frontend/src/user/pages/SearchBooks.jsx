// src/user/pages/SearchBooks.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../../apis'; // 1. Import bookAPI
import styles from './SearchBooks.module.css';

const SearchBooks = () => {
  const [query, setQuery] = useState(''); // State cho ô nhập liệu
  const [results, setResults] = useState([]); // State cho kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // State cho trạng thái loading
  const [message, setMessage] = useState('Nhập từ khóa để bắt đầu tìm kiếm.'); // State cho thông báo

  const handleSearch = async () => {
    if (!query.trim()) {
      setMessage('Vui lòng nhập từ khóa tìm kiếm.');
      setResults([]);
      return;
    }
    
    try {
      setLoading(true);
      // 2. Gọi API tìm kiếm với query
      //    Đối tượng { params: { q: query } } sẽ được chuyển thành URL dạng: /books/search?q=tên_sách
      const data = await bookAPI.search({ q: query });
      
      setResults(data);
      if (data.length === 0) {
        setMessage(`Không tìm thấy sách nào phù hợp với từ khóa "${query}".`);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách:", error);
      setMessage("Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn phím Enter trong ô input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.title}>Tìm Kiếm Sách</h1>
      <div className={styles.searchBar}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder="Nhập tên sách, tác giả..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch} disabled={loading} className={styles.searchButton}>
          {loading ? 'Đang tìm...' : 'Tìm'}
        </button>
      </div>

      <div className={styles.resultsContainer}>
        {loading ? (
          <p>Đang tìm kiếm...</p>
        ) : results.length > 0 ? (
          <ul className={styles.resultsList}>
            {results.map(book => (
              <li key={book.id} className={styles.resultItem}>
                <Link to={`/book/${book.id}`}>
                  <strong>{book.title}</strong> - <span>{book.author?.name || 'N/A'}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default SearchBooks;