import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaClock, FaBook, FaInfoCircle } from 'react-icons/fa';

const LibraryInfo = () => {
  return (
    <Container fluid className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <FaInfoCircle className="me-3" />
          Thông Tin Thư Viện Huflit
        </h1>
        <p className="lead text-muted">
          Chào mừng bạn đến với hệ thống quản lý thư viện trực tuyến của chúng tôi
        </p>
      </div>

      <Row className="g-4 mb-5">
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <Card.Title className="h3 fw-bold mb-3">
                <FaBook className="me-2 text-primary" />
                Giới Thiệu
              </Card.Title>
              <Card.Text className="lead">
                Đây là nơi bạn có thể dễ dàng tìm kiếm, tra cứu và quản lý việc mượn trả sách.
                Chúng tôi cam kết mang đến cho bạn trải nghiệm tốt nhất với kho sách phong phú và dịch vụ chuyên nghiệp.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-4">
              <Card.Title className="h4 fw-bold mb-3">
                <FaClock className="me-2 text-success" />
                Giờ Mở Cửa
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 px-0">
                  <strong>Thứ Hai - Thứ Sáu:</strong> 8:00 AM - 8:00 PM
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <strong>Thứ Bảy:</strong> 9:00 AM - 5:00 PM
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  <strong>Chủ Nhật:</strong> Đóng cửa
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Card.Title className="h4 fw-bold mb-3">
                <FaBook className="me-2 text-warning" />
                Nội Quy Thư Viện
              </Card.Title>
              <ListGroup variant="flush" className="mb-0">
                <ListGroup.Item className="border-0 px-0">
                  1. Vui lòng giữ im lặng và trật tự chung trong khu vực thư viện.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  2. Không mang đồ ăn, thức uống vào khu vực đọc sách.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  3. Sách cần được trả đúng hạn để tránh phí phạt.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  4. Bảo quản sách cẩn thận, không gấp góc hoặc viết vẽ lên sách.
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0">
                  5. Thông báo ngay cho nhân viên nếu phát hiện sách bị hỏng.
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryInfo;