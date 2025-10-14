import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center text-dark">Admin Dashboard</h2>
            <p className="text-center text-muted">Quản lý hệ thống thư viện</p>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="shadow border-0 h-100">
              <Card.Body className="text-center">
                <i className="fas fa-book fa-3x text-primary mb-3"></i>
                <h5>Quản lý sách</h5>
                <p className="text-muted">Thêm, sửa, xóa sách trong thư viện</p>
                <Button variant="primary" className="w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  Quản lý sách
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow border-0 h-100">
              <Card.Body className="text-center">
                <i className="fas fa-users fa-3x text-success mb-3"></i>
                <h5>Quản lý thành viên</h5>
                <p className="text-muted">Quản lý thông tin thành viên</p>
                <Button variant="success" className="w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  Quản lý thành viên
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow border-0 h-100">
              <Card.Body className="text-center">
                <i className="fas fa-chart-line fa-3x text-info mb-3"></i>
                <h5>Thống kê</h5>
                <p className="text-muted">Xem báo cáo và thống kê</p>
                <Button variant="info" className="w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  Xem thống kê
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="shadow border-0 h-100">
              <Card.Body className="text-center">
                <i className="fas fa-handshake fa-3x text-warning mb-3"></i>
                <h5>Mượn trả sách</h5>
                <p className="text-muted">Quản lý phiếu mượn trả</p>
                <Button variant="warning" className="w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  Quản lý mượn trả
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="shadow border-0 h-100">
              <Card.Body className="text-center">
                <i className="fas fa-cog fa-3x text-secondary mb-3"></i>
                <h5>Cài đặt hệ thống</h5>
                <p className="text-muted">Cấu hình và cài đặt hệ thống</p>
                <Button variant="secondary" className="w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  Cài đặt
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;