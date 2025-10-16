import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaUsers, FaClipboardList, FaChartLine } from 'react-icons/fa';
import HeroBanner from '../../../components/Home/HeroBanner';
import TrendingBooks from '../../../components/Home/TrendingBooks';
import FeaturedCategories from '../../../components/Home/FeaturedCategories';
import { bookAPI } from '../../../apis/index';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const data = await bookAPI.getAll();
        // Optionally sort/filter trending books here
        setBooks(data.slice(0, 6));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingBooks();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Đang tải...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <div style={{ paddingTop: '0.5rem' }}>
        <HeroBanner />
      </div>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center h-100 feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                    <FaBook className="fs-3" />
                  </div>
                  <h5 className="fw-bold mb-2">Kho Sách Phong Phú</h5>
                  <p className="text-muted small mb-0">
                    Hơn 10,000+ đầu sách từ nhiều thể loại khác nhau
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center h-100 feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                    <FaUsers className="fs-3" />
                  </div>
                  <h5 className="fw-bold mb-2">Cộng Đồng Lớn</h5>
                  <p className="text-muted small mb-0">
                    Hơn 5,000+ thành viên đang hoạt động
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center h-100 feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                    <FaClipboardList className="fs-3" />
                  </div>
                  <h5 className="fw-bold mb-2">Quản Lý Dễ Dàng</h5>
                  <p className="text-muted small mb-0">
                    Theo dõi lịch sử mượn trả tiện lợi
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6}>
              <Card className="border-0 shadow-sm text-center h-100 feature-card">
                <Card.Body className="p-4">
                  <div className="feature-icon bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                    <FaChartLine className="fs-3" />
                  </div>
                  <h5 className="fw-bold mb-2">Đề Xuất Thông Minh</h5>
                  <p className="text-muted small mb-0">
                    Gợi ý sách phù hợp với sở thích của bạn
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trending Books Section */}
      <TrendingBooks books={books} />

      {/* Featured Categories Section */}
      <FeaturedCategories />

      

      <style>{`
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
}

export default Home;