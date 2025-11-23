import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { FaBook, FaUser, FaTag, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookAPI, borrowingAPI } from '../../../apis';
import libraryCardAPI from '../../../apis/libraryCardAPI';
import { useAuth } from '../../../contexts/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowDays, setBorrowDays] = useState(15);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const data = await bookAPI.getById(id);
        setBook(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
        setError("Không thể tải thông tin sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBorrowClick = () => {
    if (!user) {
      toast.info('Vui lòng đăng nhập để mượn sách');
      navigate('/login', { state: { from: { pathname: `/books/${id}` } } });
      return;
    }
    setShowBorrowModal(true);
  };

  const handleBorrowSubmit = async () => {
    if (!book.bookItems || book.bookItems.length === 0) {
      toast.error('Hiện không có bản sách nào sẵn sàng để mượn');
      return;
    }

    const availableItem = book.bookItems.find(item => item.status === 0);
    if (!availableItem) {
      toast.error('Tất cả bản sách đều đã được mượn');
      return;
    }

    try {
      setBorrowing(true);
      
      // Check if user has a library card
      let libraryCard;
      try {
        libraryCard = await libraryCardAPI.getMyCard();
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error('Bạn chưa có thẻ thư viện. Vui lòng đăng ký thẻ để mượn sách!');
          setTimeout(() => {
            navigate('/my-library-card');
          }, 1500);
          return;
        }
        throw err;
      }

      // Check if card is active and not expired
      if (libraryCard.status !== 0) {
        toast.error('Thẻ thư viện của bạn không hoạt động. Vui lòng liên hệ thủ thư!');
        return;
      }

      const expiryDate = new Date(libraryCard.expiryDate);
      if (expiryDate < new Date()) {
        toast.error('Thẻ thư viện của bạn đã hết hạn. Vui lòng gia hạn thẻ!');
        setTimeout(() => {
          navigate('/my-library-card');
        }, 1500);
        return;
      }
      
      await borrowingAPI.borrow({
        LibraryCardId: libraryCard.id,
        BookItemId: availableItem.id,
        Days: borrowDays
      });

      toast.success(`Mượn sách "${book.title}" thành công! 🎉`, { autoClose: 2000 });
      setShowBorrowModal(false);
      
      // Navigate to borrowing page to show updated list
      setTimeout(() => {
        navigate('/borrowing', { 
          state: { 
            justBorrowed: true,
            bookTitle: book.title,
            timestamp: Date.now() // Add timestamp to force re-render
          } 
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi mượn sách');
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Đang tải chi tiết sách...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          Không tìm thấy thông tin sách.
        </Alert>
      </Container>
    );
  }

  const imageUrl = book.imageUrl || 'https://via.placeholder.com/400x600/f2f2f2/333?text=No+Image';

  return (
    <Container fluid className="py-5">
      <Row className="g-5">
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <img
                src={imageUrl}
                alt={book.title}
                className="img-fluid rounded shadow-sm mb-3"
                style={{ maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x600/f2f2f2/333?text=No+Image';
                }}
              />
              {user ? (
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={handleBorrowClick}
                  disabled={!book.bookItems || book.bookItems.length === 0}
                >
                  <FaBook className="me-2" />
                  {book.bookItems && book.bookItems.length > 0 ? 'Mượn Sách' : 'Không có sẵn'}
                </Button>
              ) : (
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="w-100"
                  onClick={handleBorrowClick}
                >
                  <FaBook className="me-2" />
                  Đăng nhập để mượn
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <h1 className="display-5 fw-bold mb-3">{book.title}</h1>

              <div className="mb-3">
                {book.bookAuthors && book.bookAuthors.length > 0 ? (
                  book.bookAuthors.map((author, index) => (
                    <Badge key={index} bg="secondary" className="me-2">
                      <FaUser className="me-1" />
                      {author.authorName}
                    </Badge>
                  ))
                ) : (
                  <Badge bg="secondary" className="me-2">
                    <FaUser className="me-1" />
                    Chưa rõ tác giả
                  </Badge>
                )}
                {book.genres && book.genres.length > 0 && (
                  book.genres.map((genre, index) => (
                    <Badge key={index} bg="info" className="me-2">
                      <FaTag className="me-1" />
                      {genre}
                    </Badge>
                  ))
                )}
              </div>

              {book.publicationYear && (
                <p className="text-muted mb-3">
                  <FaCalendarAlt className="me-2" />
                  Năm xuất bản: {book.publicationYear}
                </p>
              )}

              <hr />

              <h3 className="h4 fw-bold mb-3">Mô tả</h3>
              <p className="lead">
                {book.description || 'Chưa có mô tả cho cuốn sách này.'}
              </p>

              {book.isbn && (
                <p className="text-muted">
                  <strong>ISBN:</strong> {book.isbn}
                </p>
              )}

              {book.publisher && (
                <p className="text-muted">
                  <strong>Nhà xuất bản:</strong> {book.publisher}
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Author Information Card */}
          {book.bookAuthors && book.bookAuthors.length > 0 && (
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                <h3 className="h4 fw-bold mb-3">
                  <FaUser className="me-2 text-primary" />
                  Thông tin tác giả
                </h3>
                {book.bookAuthors.map((author, index) => (
                  <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                    <h5 className="fw-semibold text-primary">{author.authorName}</h5>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Borrow Modal */}
      <Modal show={showBorrowModal} onHide={() => setShowBorrowModal(false)} centered>
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>
            <FaBook className="me-2" />
            Tạo phiếu mượn mới
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 text-center">
            <img 
              src={imageUrl} 
              alt={book.title}
              style={{ maxWidth: '150px', height: 'auto', borderRadius: '8px' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x200/f2f2f2/333?text=No+Image';
              }}
            />
            <h5 className="mt-3 fw-bold">{book.title}</h5>
            <p className="text-muted">{book.bookAuthors?.map(ba => ba.authorName).join(', ') || 'Chưa rõ tác giả'}</p>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Số ngày mượn</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="15"
              value={borrowDays}
              onChange={(e) => setBorrowDays(Math.min(15, Number(e.target.value)))}
            />
            <Form.Text className="text-muted">
              Tối đa 15 ngày. Hạn trả dự kiến: {new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
            </Form.Text>
          </Form.Group>

          {(!book.bookItems || book.bookItems.length === 0) && (
            <Alert variant="warning">
              <FaExclamationTriangle className="me-2" />
              Hiện không có bản sách nào sẵn sàng để mượn
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBorrowModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="warning" 
            onClick={handleBorrowSubmit}
            disabled={borrowing || !book.bookItems || book.bookItems.length === 0}
            className="text-white"
          >
            {borrowing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Đang xử lý...
              </>
            ) : (
              <>
                <FaBook className="me-2" />
                Xác nhận mượn
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookDetails;