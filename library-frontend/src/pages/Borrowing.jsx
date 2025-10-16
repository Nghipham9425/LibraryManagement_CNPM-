import { Card, Button, Container, Tabs, Tab } from 'react-bootstrap';
import { FaPlus, FaExchangeAlt } from 'react-icons/fa';

const Borrowing = () => {
  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Mượn Trả</h2>
          <p className="text-muted mb-0">Theo dõi việc mượn và trả sách</p>
        </div>
        <Button variant="warning" className="d-flex align-items-center text-white">
          <FaPlus className="me-2" />
          Mượn Sách Mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Tabs defaultActiveKey="active" className="mb-3">
            <Tab eventKey="active" title="Đang Mượn">
              <div className="text-center py-5">
                <FaExchangeAlt size={64} className="text-muted mb-3" />
                <h5 className="fw-bold">Không Có Sách Đang Mượn</h5>
                <p className="text-muted">
                  Hiện tại không có sách nào đang được mượn.
                </p>
                <Button variant="outline-warning" className="mt-2 text-warning">
                  <FaPlus className="me-2" />
                  Tạo Phiếu Mượn Mới
                </Button>
              </div>
            </Tab>
            <Tab eventKey="history" title="Lịch Sử">
              <div className="text-center py-5">
                <p className="text-muted">Chưa có lịch sử mượn sách.</p>
              </div>
            </Tab>
            <Tab eventKey="overdue" title="Quá Hạn">
              <div className="text-center py-5">
                <p className="text-muted">Không có sách quá hạn.</p>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Borrowing;
