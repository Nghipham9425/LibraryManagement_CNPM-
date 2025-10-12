import { Card, Button, Container } from "react-bootstrap"
import { FaTags } from "react-icons/fa"

const Genres = () => {
  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Thể Loại</h2>
          <p className="text-muted mb-0">
            Quản lý các thể loại sách trong thư viện
          </p>
        </div>
        <Button variant="info" className="d-flex align-items-center text-white">
          <FaTags className="me-2" />
          Thêm Thể Loại
        </Button>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <FaTags size={64} className="text-muted mb-3" />
          <h5 className="fw-bold">Chưa Có Thể Loại</h5>
          <p className="text-muted">
            Bắt đầu bằng cách thêm thể loại đầu tiên vào thư viện.
          </p>
          <Button variant="outline-info" className="mt-2 text-info">
            <FaTags className="me-2" />
            Thêm Thể Loại Đầu Tiên
          </Button>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Genres
