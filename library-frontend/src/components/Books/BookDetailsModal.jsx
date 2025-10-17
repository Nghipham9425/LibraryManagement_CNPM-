import { Modal, Button, Row, Col, Image, Badge } from "react-bootstrap"
import { FaTimes } from "react-icons/fa"

const BookDetailsModal = ({ show, onHide, book }) => {
  if (!book) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="bg-light">
        <Modal.Title className="fw-bold">Chi Tiết Sách</Modal.Title>
        <Button variant="link" onClick={onHide} className="p-0 text-dark">
          <FaTimes size={20} />
        </Button>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row>
          <Col md={4} className="text-center mb-3 mb-md-0">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={`Ảnh bìa ${book.title}`}
                fluid
                rounded
                style={{ maxHeight: 300, objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center rounded"
                style={{ height: 300 }}
              >
                <span className="text-muted">Không có ảnh</span>
              </div>
            )}
          </Col>
          <Col md={8}>
            <h4 className="mb-3">{book.title}</h4>
            <div className="mb-3">
              <strong className="text-muted">Tác Giả:</strong>
              <p className="mb-0">{book.bookAuthors ? book.bookAuthors.map(ba => ba.authorName).filter(name => name).join(', ') : 'Không có thông tin'}</p>
            </div>
            {book.genres && book.genres.length > 0 && (
              <div className="mb-3">
                <strong className="text-muted">Thể Loại:</strong>
                <div>
                  {book.genres.map((genre, index) => (
                    <Badge key={index} bg="primary" className="me-2 mb-1">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {book.isbn && (
              <div className="mb-3">
                <strong className="text-muted">ISBN:</strong>
                <p className="mb-0">{book.isbn}</p>
              </div>
            )}
            {book.publicationYear && (
              <div className="mb-3">
                <strong className="text-muted">Năm Xuất Bản:</strong>
                <p className="mb-0">{book.publicationYear}</p>
              </div>
            )}
            {book.publisher && (
              <div className="mb-3">
                <strong className="text-muted">Nhà Xuất Bản:</strong>
                <p className="mb-0">{book.publisher}</p>
              </div>
            )}
            {book.description && (
              <div className="mb-3">
                <strong className="text-muted">Mô Tả:</strong>
                <div style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '0.97rem',
                  color: '#495057',
                  wordBreak: 'break-word',
                }}>
                  {book.description}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BookDetailsModal
