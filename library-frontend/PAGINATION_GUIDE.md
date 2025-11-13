# Hướng dẫn sử dụng Pagination Component

## 1. Import components và hooks

```jsx
import Pagination from '../../components/Pagination';
import usePagination from '../../hooks/usePagination';
```

## 2. Sử dụng usePagination hook

```jsx
const YourComponent = () => {
  const [items, setItems] = useState([]); // Your data array

  // Use pagination hook
  const {
    currentPage,      // Trang hiện tại (1, 2, 3, ...)
    totalPages,       // Tổng số trang
    currentItems,     // Items của trang hiện tại
    goToPage,         // Function để chuyển trang: goToPage(pageNumber)
    totalItems,       // Tổng số items
    startIndex,       // Index bắt đầu hiển thị (VD: 1, 11, 21)
    endIndex,         // Index kết thúc hiển thị (VD: 10, 20, 30)
    nextPage,         // Function để chuyển trang tiếp theo
    prevPage,         // Function để quay lại trang trước
    resetPage,        // Function để reset về trang 1
  } = usePagination(items, 10); // items: data array, 10: items per page

  return (
    <div>
      {/* Hiển thị thông tin phân trang */}
      <div className="mb-3 text-muted">
        Hiển thị {startIndex} - {endIndex} của {totalItems} mục
      </div>

      {/* Hiển thị items của trang hiện tại */}
      <Table>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
};
```

## 3. Tùy chỉnh số items mỗi trang

```jsx
// Mặc định: 10 items/page
const pagination1 = usePagination(items); 

// Custom: 20 items/page
const pagination2 = usePagination(items, 20);

// Custom: 5 items/page
const pagination3 = usePagination(items, 5);
```

## 4. Các features của Pagination Component

- ✅ Nút First/Last page
- ✅ Nút Previous/Next
- ✅ Hiển thị số trang (với ellipsis ... cho nhiều trang)
- ✅ Highlight trang hiện tại
- ✅ Disable buttons khi ở trang đầu/cuối
- ✅ Hiển thị "Trang X / Y"
- ✅ Responsive với Bootstrap
- ✅ Tự động ẩn khi chỉ có 1 trang

## 5. Ví dụ hoàn chỉnh

```jsx
import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import usePagination from '../../hooks/usePagination';

const BooksPage = () => {
  const [books, setBooks] = useState([]);

  // Pagination with 15 books per page
  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(books, 15);

  useEffect(() => {
    // Fetch books...
    fetchBooks();
  }, []);

  return (
    <Container>
      <h2>Danh sách sách</h2>
      
      <div className="mb-3 text-muted">
        Hiển thị {startIndex} - {endIndex} của {totalItems} cuốn sách
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Năm xuất bản</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </Container>
  );
};
```

## 6. Notes

- Component tự động ẩn khi `totalPages <= 1`
- Data được xử lý ở frontend (client-side pagination)
- Nếu cần server-side pagination, chỉ cần modify usePagination hook
- Styling dựa trên React Bootstrap - có thể customize CSS nếu cần
