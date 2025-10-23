import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaBook, FaUser, FaTag, FaCalendarAlt } from 'react-icons/fa';
import { bookAPI } from '../../../apis';
const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <Button variant="primary" size="lg" className="w-100">
                <FaBook className="me-2" />
                Mượn Sách
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h1 className="display-5 fw-bold mb-3">{book.title}</h1>

              <div className="mb-3">
                <Badge bg="secondary" className="me-2">
                  <FaUser className="me-1" />
                  {book.author?.name || 'Chưa rõ tác giả'}
                </Badge>
                <Badge bg="info">
                  <FaTag className="me-1" />
                  {book.genre?.name || 'Chưa phân loại'}
                </Badge>
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
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetails;