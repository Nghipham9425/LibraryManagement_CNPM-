import { Card, Button, Container } from 'react-bootstrap';
import { FaPlus, FaBook } from 'react-icons/fa';

const Books = () => {
  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Sách</h2>
          <p className="text-muted mb-0">Quản lý bộ sưu tập sách trong thư viện</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center text-white">
          <FaPlus className="me-2" />
          Thêm Sách Mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <FaBook size={64} className="text-muted mb-3" />
          <h5 className="fw-bold">Chưa Có Sách</h5>
          <p className="text-muted">
            Bắt đầu bằng cách thêm cuốn sách đầu tiên vào thư viện.
          </p>
          <Button variant="outline-primary" className="mt-2 text-primary">
            <FaPlus className="me-2" />
            Thêm Sách Đầu Tiên
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Books;
