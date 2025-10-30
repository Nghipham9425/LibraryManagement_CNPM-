
import { Card, Badge, Button } from 'react-bootstrap'
import { FaTimes, FaBook, FaCalendar, FaBuilding, FaBarcode, FaExternalLinkAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BookInfoPanel = ({ book, onClose }) => {
  const navigate = useNavigate();
  if (!book) return null

  const handleGoToDetail = () => {
    navigate(`/books/${book.id}`)
    onClose && onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '400px',
          height: '100vh',
          zIndex: 1000,
          overflowY: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="p-4">
          {/* Close button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 fw-bold">Chi Tiết Sách</h4>
            <Button
              variant="link"
              onClick={onClose}
              className="p-0 text-dark"
              style={{ fontSize: '1.5rem' }}
            >
              <FaTimes />
            </Button>
          </div>

          {/* Book cover image */}
          {book.imageUrl && (
            <div className="text-center mb-4">
              <img
                src={book.imageUrl}
                alt={book.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              />
            </div>
          )}

          {/* Book title */}
          <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>
            {book.title}
          </h5>

          {/* Authors */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <FaBook className="me-2 text-primary" />
              <strong className="text-muted">Tác Giả</strong>
            </div>
            <p className="mb-0 ms-4">
              {book.bookAuthors && book.bookAuthors.length > 0
                ? book.bookAuthors
                    .map((ba) => ba.authorName)
                    .filter((name) => name)
                    .join(', ')
                : 'Không có thông tin'}
            </p>
          </div>

          {/* Genre */}
          {book.genre && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <strong className="text-muted">Thể Loại</strong>
              </div>
              <Badge bg="primary" className="ms-0">
                {typeof book.genre === 'string' ? book.genre : book.genre.name}
              </Badge>
            </div>
          )}

          {/* ISBN */}
          {book.isbn && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <FaBarcode className="me-2 text-primary" />
                <strong className="text-muted">ISBN</strong>
              </div>
              <p className="mb-0 ms-4">{book.isbn}</p>
            </div>
          )}

          {/* Publication Year */}
          {book.publicationYear && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <FaCalendar className="me-2 text-primary" />
                <strong className="text-muted">Năm Xuất Bản</strong>
              </div>
              <p className="mb-0 ms-4">{book.publicationYear}</p>
            </div>
          )}

          {/* Publisher */}
          {book.publisher && (
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <FaBuilding className="me-2 text-primary" />
                <strong className="text-muted">Nhà Xuất Bản</strong>
              </div>
              <p className="mb-0 ms-4">{book.publisher}</p>
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div className="mb-3">
              <strong className="text-muted d-block mb-2">Mô Tả</strong>
              <div
                style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '0.95rem',
                  color: '#495057',
                  lineHeight: '1.6',
                }}
              >
                {book.description}
              </div>
            </div>
          )}

          {/* Go to detail button */}
          <div className="d-grid mt-4">
            <Button variant="outline-primary" onClick={handleGoToDetail}>
              Xem chi tiết sách <FaExternalLinkAlt className="ms-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BookInfoPanel