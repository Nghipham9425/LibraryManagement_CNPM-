import { Card, Row, Col, Container } from 'react-bootstrap';
import { FaBook, FaUsers, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';

const Dashboard = () => {

  const stats = [
    {
      title: 'Tổng Số Sách',
      value: '0',
      icon: FaBook,
      color: '#0d6efd',
      bgColor: 'rgba(13, 110, 253, 0.1)',
    },
    {
      title: 'Tổng Thành Viên',
      value: '0',
      icon: FaUsers,
      color: '#198754',
      bgColor: 'rgba(25, 135, 84, 0.1)',
    },
    {
      title: 'Đang Mượn',
      value: '0',
      icon: FaExchangeAlt,
      color: '#ffc107',
      bgColor: 'rgba(255, 193, 7, 0.1)',
    },
    {
      title: 'Trả Hôm Nay',
      value: '0',
      icon: FaCheckCircle,
      color: '#0dcaf0',
      bgColor: 'rgba(13, 202, 240, 0.1)',
    },
  ];

  return (
    <Container fluid>
      <div className="mb-4">
        <h2 className="fw-bold">Tổng Quan</h2>
        <p className="text-muted">
          Chào mừng đến với Hệ Thống Quản Lý Thư Viện
        </p>
      </div>

      <Row className="g-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: stat.bgColor,
                    }}
                  >
                    <stat.icon size={28} style={{ color: stat.color }} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">Thao Tác Nhanh</h5>
              <p className="text-muted">
                Sử dụng menu điều hướng bên trái để quản lý sách, thành viên và hồ sơ mượn trả.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
