// src/user/pages/BookCategories.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { FaBookOpen } from 'react-icons/fa';
import { genreAPI } from '../../apis';

const BookCategories = () => {
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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Đang tải danh mục...</span>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <FaBookOpen className="me-3" />
          Danh Mục Sách
        </h1>
        <p className="lead text-muted">
          Khám phá các thể loại sách đa dạng trong thư viện
        </p>
      </div>

      {error && <Alert variant="danger" className="text-center mb-4">{error}</Alert>}

      <Row className="g-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Col key={category.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm border-0 hover-card">
                <Card.Body className="text-center p-4">
                  <FaBookOpen size={48} className="text-primary mb-3" />
                  <Card.Title className="fw-bold">{category.name}</Card.Title>
                  <Card.Text className="text-muted">
                    Khám phá sách trong thể loại này
                  </Card.Text>
                  <Card.Link
                    as={Link}
                    to={`/categories/${category.name}`}
                    className="btn btn-primary stretched-link"
                  >
                    Xem Chi Tiết
                  </Card.Link>
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

export default BookCategories;