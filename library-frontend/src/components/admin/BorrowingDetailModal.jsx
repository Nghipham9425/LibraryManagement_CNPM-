import { Modal, Button, Row, Col, Badge, Image } from 'react-bootstrap';
import { FaUser, FaBook, FaCalendarAlt, FaUndo } from 'react-icons/fa';

const BorrowingDetailModal = ({ show, onHide, borrowing, onReturn, onRefresh }) => {
  if (!borrowing) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <Badge bg="warning">Đang mượn</Badge>;
      case 1: return <Badge bg="success">Đã trả</Badge>;
      case 2: return <Badge bg="danger">Mất sách</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getCardStatusBadge = (status) => {
    switch (status) {
      case 0: return <Badge bg="success">Hoạt động</Badge>;
      case 1: return <Badge bg="danger">Hết hạn</Badge>;
      case 2: return <Badge bg="secondary">Bị khóa</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const isOverdue = (dueDate, status) => {
    return status === 0 && new Date(dueDate) < new Date();
  };

  const overdueDays = isOverdue(borrowing.dueDate, borrowing.status)
    ? Math.floor((new Date() - new Date(borrowing.dueDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết phiếu mượn #{borrowing.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
          <Col md={6}>
            <h5><FaUser className="me-2" />Thông tin người mượn</h5>
            <hr />
            <p><strong>Tên:</strong> {borrowing.userName || 'N/A'}</p>
            <p><strong>Mã thẻ:</strong> {borrowing.libraryCardId}</p>
            <p>
              <strong>Trạng thái thẻ:</strong>{' '}
              {borrowing.libraryCardStatus !== null && borrowing.libraryCardStatus !== undefined
                ? getCardStatusBadge(borrowing.libraryCardStatus)
                : 'N/A'}
            </p>
          </Col>
          <Col md={6}>
            <h5><FaCalendarAlt className="me-2" />Thông tin mượn trả</h5>
            <hr />
            <p><strong>Ngày mượn:</strong> {formatDate(borrowing.borrowDate)}</p>
            <p>
              <strong>Hạn trả:</strong> {formatDate(borrowing.dueDate)}
              {isOverdue(borrowing.dueDate, borrowing.status) && (
                <Badge bg="danger" className="ms-2">
                  Quá hạn {overdueDays} ngày
                </Badge>
              )}
            </p>
            <p><strong>Ngày trả:</strong> {borrowing.returnDate ? formatDate(borrowing.returnDate) : 'Chưa trả'}</p>
            <p><strong>Trạng thái:</strong> {getStatusBadge(borrowing.status)}</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h5><FaBook className="me-2" />Thông tin sách</h5>
            <hr />
            {borrowing.bookItem?.book ? (
              <Row>
                <Col md={3}>
                  <Image
                    src={borrowing.bookItem.book.imageUrl || 'https://via.placeholder.com/150'}
                    alt={borrowing.bookItem.book.title}
                    fluid
                    rounded
                  />
                </Col>
                <Col md={9}>
                  <h6>{borrowing.bookItem.book.title}</h6>
                  <p><strong>Tác giả:</strong> {borrowing.bookItem.book.authors?.join(', ') || 'N/A'}</p>
                  <p><strong>Thể loại:</strong> {borrowing.bookItem.book.genres?.join(', ') || 'N/A'}</p>
                  <p><strong>Nhà xuất bản:</strong> {borrowing.bookItem.book.publisher || 'N/A'}</p>
                  <p><strong>Năm xuất bản:</strong> {borrowing.bookItem.book.publicationYear || 'N/A'}</p>
                  <p><strong>Mã kiểm soát:</strong> {borrowing.bookItem.controlNumber}</p>
                  <p>
                    <strong>Trạng thái bản sao:</strong>{' '}
                    {borrowing.bookItem.status === 0 ? (
                      <Badge bg="success">Có sẵn</Badge>
                    ) : borrowing.bookItem.status === 1 ? (
                      <Badge bg="warning">Đang mượn</Badge>
                    ) : (
                      <Badge bg="danger">Không khả dụng</Badge>
                    )}
                  </p>
                </Col>
              </Row>
            ) : (
              <p>Không có thông tin sách</p>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {borrowing.status === 0 && (
          <Button
            variant="success"
            onClick={() => {
              if (confirm('Xác nhận trả sách cho phiếu mượn này?')) {
                onReturn(borrowing.id);
                onRefresh();
                onHide();
              }
            }}
          >
            <FaUndo className="me-2" />
            Trả sách
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BorrowingDetailModal;
