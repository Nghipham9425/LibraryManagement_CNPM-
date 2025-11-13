import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaUserEdit, FaBook, FaGlobeAsia } from 'react-icons/fa';
import { authorAPI, bookAPI } from '../../../apis';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsData, booksData] = await Promise.all([
          authorAPI.getAll(),
          bookAPI.getAll()
        ]);
        setAuthors(authorsData);
        setBooks(booksData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tác giả:", error);
        setError("Không thể tải danh sách tác giả. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Đếm số sách của mỗi tác giả
  const getBookCountByAuthor = (authorName) => {
    return books.filter(book => 
      book.bookAuthors && book.bookAuthors.some(ba => ba.authorName === authorName)
    ).length;
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Đang tải danh sách tác giả...</span>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <FaUserEdit className="me-3 text-primary" />
          Tác Giả
        </h1>
        <p className="lead text-muted">
          Khám phá {authors.length} tác giả và những tác phẩm của họ
        </p>
      </div>

      {error && <Alert variant="danger" className="text-center mb-4">{error}</Alert>}

      <Row className="g-4">
        {authors.length > 0 ? (
          authors.map((author) => {
            const bookCount = getBookCountByAuthor(author.name);
            return (
              <Col key={author.id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="h-100 shadow-sm border-0"
                  style={{ 
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Card.Body className="p-4 text-center d-flex flex-column">
                    {/* Avatar placeholder */}
                    <div 
                      className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{ width: '100px', height: '100px' }}
                    >
                      <FaUserEdit size={48} className="text-primary" />
                    </div>
                    
                    <Card.Title className="fw-bold mb-2 fs-5">
                      {author.name}
                    </Card.Title>
                    
                    {author.biography && (
                      <Card.Text className="text-muted small mb-3" style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {author.biography}
                      </Card.Text>
                    )}

                    <div className="mt-auto">
                      {/* Quốc gia */}
                      {author.nationality && (
                        <div className="mb-2">
                          <Badge bg="info" className="me-1">
                            <FaGlobeAsia className="me-1" />
                            {author.nationality}
                          </Badge>
                        </div>
                      )}

                      {/* Số sách */}
                      <div className="mb-3">
                        <Badge bg="success">
                          <FaBook className="me-1" />
                          {bookCount} cuốn sách
                        </Badge>
                      </div>

                      {/* Button xem sách */}
                      <Link
                        to={`/books?author=${encodeURIComponent(author.name)}`}
                        className="btn btn-primary btn-sm w-100"
                      >
                        Xem Tác Phẩm
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              Không có tác giả nào để hiển thị.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Authors;
