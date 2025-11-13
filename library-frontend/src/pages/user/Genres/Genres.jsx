import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaBookOpen, FaBook } from 'react-icons/fa';
import { genreAPI } from '../../../apis';

const Genres = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await genreAPI.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thể loại:", error);
        setError("Không thể tải danh sách thể loại. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Màu sắc cho các card
  const colors = [
    'primary', 'success', 'info', 'warning', 'danger', 
    'secondary', 'dark', 'primary', 'success', 'info'
  ];

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Đang tải danh mục...</span>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">
          <FaBookOpen className="me-3 text-primary" />
          Thể Loại Sách
        </h1>
        <p className="lead text-muted">
          Khám phá {categories.length} thể loại sách đa dạng trong thư viện
        </p>
      </div>

      {error && <Alert variant="danger" className="text-center mb-4">{error}</Alert>}

      <Row className="g-4">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <Col key={category.id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                className="h-100 shadow-sm border-0 hover-card text-center"
                style={{ 
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div 
                    className={`bg-${colors[index % colors.length]} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`}
                    style={{ width: '80px', height: '80px' }}
                  >
                    <FaBook 
                      size={36} 
                      className={`text-${colors[index % colors.length]}`}
                    />
                  </div>
                  
                  <Card.Title className="fw-bold mb-2">{category.name}</Card.Title>
                  <Card.Text className="text-muted small mb-3 flex-grow-1">
                    {category.description || 'Khám phá sách trong thể loại này'}
                  </Card.Text>
                  
                  <Link
                    to={`/books?genre=${encodeURIComponent(category.name)}`}
                    className={`btn btn-${colors[index % colors.length]} btn-sm`}
                  >
                    Xem Sách
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              Không có thể loại nào để hiển thị.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Genres;
