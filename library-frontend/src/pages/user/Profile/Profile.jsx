
// src/user/pages/Profile.jsx

import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaIdCard, FaEdit, FaSignOutAlt } from 'react-icons/fa';

// Dữ liệu mẫu, sau này sẽ lấy từ thông tin người dùng đăng nhập
const userData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  memberId: 'DG00123',
  joinDate: '2023-01-15',
  booksBorrowed: 5,
  booksReturned: 4,
};

const Profile = () => {
  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <FaUser size={48} className="mb-2" />
              <h2 className="h4 mb-0">Thông Tin Cá Nhân</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <FaUser className="me-2 text-primary" />
                    <strong>Họ và Tên</strong>
                  </div>
                  <span>{userData.name}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <FaEnvelope className="me-2 text-primary" />
                    <strong>Email</strong>
                  </div>
                  <span>{userData.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <FaIdCard className="me-2 text-primary" />
                    <strong>Mã độc giả</strong>
                  </div>
                  <span>{userData.memberId}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <FaUser className="me-2 text-primary" />
                    <strong>Ngày tham gia</strong>
                  </div>
                  <span>{new Date(userData.joinDate).toLocaleDateString('vi-VN')}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <FaUser className="me-2 text-primary" />
                    <strong>Sách đã mượn</strong>
                  </div>
                  <span>{userData.booksBorrowed}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <FaUser className="me-2 text-primary" />
                    <strong>Sách đã trả</strong>
                  </div>
                  <span>{userData.booksReturned}</span>
                </ListGroup.Item>
              </ListGroup>

              <div className="d-flex gap-2 justify-content-center">
                <Button variant="primary">
                  <FaEdit className="me-2" />
                  Cập Nhật Thông Tin
                </Button>
                <Button variant="outline-danger">
                  <FaSignOutAlt className="me-2" />
                  Đăng Xuất
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
