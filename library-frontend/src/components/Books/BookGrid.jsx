import { Row, Col, Card, Button, Dropdown, Badge } from "react-bootstrap"
import { FaEllipsisV, FaEdit, FaTrash, FaEye, FaBook, FaCopy } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "../../styles/bookGrid.css"

const BookGrid = ({ books, onEdit, onDelete, onViewDetails, onManageItems, showAdminActions = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  return (
    <Row className="g-3">
      {books.map((book) => (
        <Col key={book.id} xs={12} sm={6} md={4} lg={4} xl={4}>
          <Card className="h-100 shadow-sm book-card">
            <div className="book-card-image-wrap">
              <div className="book-card-topbar">
                {book.genres && book.genres.length > 0 && (
                  <div className="book-card-genres">
                    {book.genres.slice(0, 2).map((genre, index) => (
                      <Badge key={index} bg="light" className="book-card-genre me-1">
                        {genre}
                      </Badge>
                    ))}
                    {book.genres.length > 2 && (
                      <Badge bg="light" className="book-card-genre">
                        +{book.genres.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                {/* Chỉ hiển thị dropdown menu cho admin */}
                {showAdminActions && (
                  <Dropdown className="book-card-dropdown">
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="book-card-dropdown-toggle"
                      id={`dropdown-${book.id}`}
                    >
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="book-card-dropdown-menu">
                      <Dropdown.Item
                        onClick={() => onEdit(book)}
                        className="book-card-dropdown-item"
                      >
                        <FaEdit className="me-2" />
                        Sửa
                      </Dropdown.Item>
                      {onManageItems && (
                        <Dropdown.Item
                          onClick={() => onManageItems(book)}
                          className="book-card-dropdown-item"
                        >
                          <FaCopy className="me-2" />
                          Quản lý bản sao
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        onClick={() => onDelete(book.id)}
                        className="book-card-dropdown-item text-danger"
                      >
                        <FaTrash className="me-2" />
                        Xóa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
              {book.imageUrl ? (
                <Card.Img
                  variant="top"
                  src={book.imageUrl}
                  alt={`Ảnh bìa ${book.title}`}
                  className="book-card-image"
                />
              ) : (
                <div className="book-card-image-placeholder">
                  <span className="text-muted">Không có ảnh</span>
                </div>
              )}
            </div>
            <Card.Body className="d-flex flex-column p-3">
              <Card.Title className="text-truncate mb-2" title={book.title}>
                {book.title}
              </Card.Title>
              <Card.Text className="text-muted small mb-1">
                <strong>Tác giả:</strong>{" "}
                {book.bookAuthors
                  ? book.bookAuthors
                      .map((ba) => ba.authorName)
                      .filter((name) => name)
                      .join(", ")
                  : "Không có thông tin"}
              </Card.Text>
              {book.publicationYear && (
                <Card.Text className="text-muted small mb-2">
                  <strong>Năm:</strong> {book.publicationYear}
                </Card.Text>
              )}
              {/* Hiển thị số lượng sách */}
              <Card.Text className="text-muted small mb-3">
                <strong>Số lượng:</strong>{" "}
                <span className={book.availableCopies > 0 ? "text-success" : "text-danger"}>
                  {book.availableCopies}/{book.totalCopies} cuốn
                </span>
              </Card.Text>
              <div className="d-flex gap-2 mt-auto">
                {showAdminActions ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-100"
                    onClick={() => onViewDetails(book)}
                  >
                    <FaEye className="me-2" />
                    Xem Chi Tiết
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-grow-1"
                      disabled={!book.availableCopies || book.availableCopies === 0}
                      onClick={() => {
                        if (!user) {
                          navigate('/login', { state: { from: { pathname: `/books/${book.id}` } } })
                        } else {
                          navigate(`/books/${book.id}`)
                        }
                      }}
                    >
                      <FaBook className="me-1" />
                      {book.availableCopies > 0 ? "Mượn" : "Hết sách"}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => {
                        if (!user) {
                          navigate('/login', { state: { from: { pathname: `/books/${book.id}` } } })
                        } else {
                          navigate(`/books/${book.id}`)
                        }
                      }}
                    >
                      <FaEye className="me-1" />
                      Chi tiết
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default BookGrid
