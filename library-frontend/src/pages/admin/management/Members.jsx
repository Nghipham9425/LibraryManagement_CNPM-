import { Card, Button, Container } from 'react-bootstrap';
import { FaPlus, FaUsers } from 'react-icons/fa';

const Members = () => {
  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Thành Viên</h2>
          <p className="text-muted mb-0">Quản lý thành viên thư viện và tài khoản của họ</p>
        </div>
        <Button variant="success" className="d-flex align-items-center text-white">
          <FaPlus className="me-2" />
          Thêm Thành Viên
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <FaUsers size={64} className="text-muted mb-3" />
          <h5 className="fw-bold">Chưa Có Thành Viên</h5>
          <p className="text-muted">
            Bắt đầu bằng cách đăng ký thành viên thư viện đầu tiên.
          </p>
          <Button variant="outline-success" className="mt-2 text-success">
            <FaPlus className="me-2" />
            Thêm Thành Viên Đầu Tiên
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Members;
