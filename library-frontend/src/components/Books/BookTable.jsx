import { Table, Button } from "react-bootstrap"
import { FaEdit, FaTrash } from "react-icons/fa"

/**
 * Component hiển thị bảng danh sách sách
 * @param {Array} books - Danh sách sách đã lọc
 * @param {Function} onEdit - Hàm xử lý sửa sách
 * @param {Function} onDelete - Hàm xử lý xóa sách
 */
const BookTable = ({ books, onEdit, onDelete }) => {
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ảnh Bìa</th>
          <th>Tên Sách</th>
          <th>Tác Giả</th>
          <th>ISBN</th>
          <th>Thể Loại</th>
          <th>Năm XB</th>
          <th>Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.id}</td>
            <td>
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={`Ảnh bìa ${book.title}`}
                  style={{
                    width: 48,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <span className="text-muted">Không có ảnh</span>
              )}
            </td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.isbn || "-"}</td>
            <td>{book.genre || "-"}</td>
            <td>{book.publicationYear || "-"}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(book)}
                title="Sửa sách"
              >
                <FaEdit />
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(book.id)}
                title="Xóa sách"
              >
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default BookTable
