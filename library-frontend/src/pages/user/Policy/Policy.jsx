import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { FaBook, FaClock, FaMoneyBillWave, FaExclamationTriangle, FaUserCheck } from 'react-icons/fa';

const Policy = () => {
  return (
    <Container className="my-5">
      {/* Hero Section */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Quy Định Thư Viện
            </h1>
            <p className="lead text-muted">
              Các quy định về mượn trả sách và sử dụng dịch vụ thư viện
            </p>
          </div>
        </Col>
      </Row>

      {/* Main Policies */}
      <Row className="g-4">
        {/* Borrowing Rules */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaBook size={32} className="text-primary me-3" />
                <h4 className="mb-0">Quy Định Mượn Sách</h4>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <strong>Số lượng:</strong> Tối đa 3 đầu sách/tài khoản
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Thời hạn:</strong> 15 ngày kể từ ngày mượn
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Gia hạn:</strong> Tối đa 1 lần (7 ngày)
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Tổng thời gian:</strong> Không quá 22 ngày
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Điều kiện:</strong> Thẻ thư viện còn hiệu lực
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Time Policy */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaClock size={32} className="text-success me-3" />
                <h4 className="mb-0">Thời Gian Phục Vụ</h4>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  <strong>Thứ 2 - Thứ 6:</strong> 8:00 - 17:00
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Thứ 7:</strong> 8:00 - 12:00
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Chủ nhật:</strong> Nghỉ
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Mượn trực tuyến:</strong> 24/7
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Nhận sách:</strong> Trong giờ làm việc
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Fine Policy */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaMoneyBillWave size={32} className="text-warning me-3" />
                <h4 className="mb-0">Phí và Phạt</h4>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span><strong>Quá hạn:</strong> 5,000 VNĐ/ngày/cuốn</span>
                  <Badge bg="warning">Phạt</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span><strong>Sách mất:</strong> 100,000 VNĐ/cuốn</span>
                  <Badge bg="danger">Phạt</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span><strong>Sách hỏng:</strong> 50,000 VNĐ/cuốn</span>
                  <Badge bg="danger">Phạt</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span><strong>Mượn sách:</strong> Miễn phí</span>
                  <Badge bg="success">Free</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                  <span><strong>Làm thẻ:</strong> Miễn phí</span>
                  <Badge bg="success">Free</Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Prohibited Actions */}
        <Col lg={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaExclamationTriangle size={32} className="text-danger me-3" />
                <h4 className="mb-0">Các Hành Vi Cấm</h4>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0">
                  ❌ Làm hỏng, rách, viết vẽ lên sách
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  ❌ Cho người khác mượn sách thay
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  ❌ Sử dụng thẻ thư viện của người khác
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  ❌ Mang sách ra khỏi thư viện khi chưa mượn
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  ❌ Ăn uống, gây ồn trong khu vực thư viện
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Member Responsibilities */}
      <Row className="mt-5">
        <Col lg={10} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <FaUserCheck size={32} className="text-info me-3" />
                <h4 className="mb-0">Trách Nhiệm Của Bạn Đọc</h4>
              </div>
              <Row>
                <Col md={6}>
                  <h6 className="fw-bold text-primary mb-3">Khi Mượn Sách:</h6>
                  <ul className="text-muted">
                    <li>Kiểm tra tình trạng sách trước khi mượn</li>
                    <li>Báo ngay nếu phát hiện sách bị hỏng</li>
                    <li>Bảo quản sách cẩn thận trong thời gian mượn</li>
                    <li>Không cho người khác mượn lại</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold text-primary mb-3">Khi Trả Sách:</h6>
                  <ul className="text-muted">
                    <li>Trả đúng hạn hoặc gia hạn trước khi quá hạn</li>
                    <li>Trả sách trong tình trạng như ban đầu</li>
                    <li>Thanh toán phí phạt (nếu có) trước khi mượn tiếp</li>
                    <li>Nhận xác nhận trả sách từ thủ thư</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Note */}
      <Row className="mt-4">
        <Col lg={10} className="mx-auto">
          <Card className="bg-light border-0">
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3">📌 Lưu Ý Quan Trọng:</h6>
              <ul className="mb-0 text-muted">
                <li>Tất cả quy định trên có thể thay đổi mà không cần báo trước</li>
                <li>Bạn đọc vi phạm nghiêm trọng có thể bị tạm ngưng quyền mượn sách</li>
                <li>Thẻ thư viện có hiệu lực 4 năm, cần gia hạn khi hết hạn</li>
                <li>Liên hệ thủ thư nếu có thắc mắc về quy định</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Policy;
