import { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaIdCard, FaCalendarAlt, FaUser, FaClock } from 'react-icons/fa';
import libraryCardAPI from '../../../apis/libraryCardAPI';
import RegisterLibraryCardModal from '../../../components/RegisterLibraryCardModal';

const MyLibraryCard = () => {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    fetchMyCard();
  }, []);

  const fetchMyCard = async () => {
    try {
      setLoading(true);
      const data = await libraryCardAPI.getMyCard();
      setCard(data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('');
        setCard(null);
      } else {
        setError(err.response?.data?.message || 'Không thể tải thông tin thẻ thư viện');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSuccess = (newCard) => {
    setCard(newCard);
    setShowRegisterModal(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getDaysRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusBadge = (status, expiryDate) => {
    if (status === 1) {
      return <Badge bg="secondary" className="fs-6">Không hoạt động</Badge>;
    }
    if (isExpired(expiryDate)) {
      return <Badge bg="danger" className="fs-6">Hết hạn</Badge>;
    }
    return <Badge bg="success" className="fs-6">Hoạt động</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!card) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="text-center py-5">
                <FaIdCard size={80} className="text-muted mb-4" />
                <h3>Bạn chưa có thẻ thư viện</h3>
                <p className="text-muted mb-4">
                  Bạn cần đăng ký thẻ thư viện để có thể mượn sách từ thư viện.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowRegisterModal(true)}
                >
                  Đăng ký thẻ thư viện
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <RegisterLibraryCardModal
          show={showRegisterModal}
          onHide={() => setShowRegisterModal(false)}
          onSuccess={handleRegisterSuccess}
        />
      </Container>
    );
  }

  const daysRemaining = getDaysRemaining(card.expiryDate);
  const expired = isExpired(card.expiryDate);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h2 className="mb-4">
            <FaIdCard className="me-2" />
            Thẻ thư viện của tôi
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Alert for expired or expiring soon */}
          {expired ? (
            <Alert variant="danger">
              <strong>Thẻ đã hết hạn!</strong> Vui lòng liên hệ thủ thư để gia hạn thẻ.
            </Alert>
          ) : daysRemaining <= 30 && daysRemaining > 0 ? (
            <Alert variant="warning">
              <strong>Thẻ sắp hết hạn!</strong> Còn {daysRemaining} ngày. Vui lòng gia hạn thẻ sớm.
            </Alert>
          ) : null}

          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="mb-0">Thông tin thẻ thư viện</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <FaIdCard size={24} className="text-primary me-3" />
                    <div>
                      <small className="text-muted d-block">Mã thẻ</small>
                      <strong className="fs-5">{card.cardNumber}</strong>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <div className="ms-auto">
                      {getStatusBadge(card.status, card.expiryDate)}
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="d-flex align-items-start mb-3">
                    <FaUser size={20} className="text-secondary me-3 mt-1" />
                    <div>
                      <small className="text-muted d-block">Tên sinh viên</small>
                      <span className="fs-6">{card.studentName}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-start mb-3">
                    <FaUser size={20} className="text-secondary me-3 mt-1" />
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <span className="fs-6">{card.email}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="d-flex align-items-start mb-3">
                    <FaClock size={20} className="text-secondary me-3 mt-1" />
                    <div>
                      <small className="text-muted d-block">Ngày tạo thẻ</small>
                      <span className="fs-6">{formatDate(card.createdAt)}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-start mb-3">
                    <FaCalendarAlt size={20} className="text-secondary me-3 mt-1" />
                    <div>
                      <small className="text-muted d-block">Ngày hết hạn</small>
                      <span className="fs-6">
                        {formatDate(card.expiryDate)}
                        {!expired && daysRemaining > 0 && (
                          <small className="text-muted ms-2">
                            (còn {daysRemaining} ngày)
                          </small>
                        )}
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              {!expired && card.status === 0 && (
                <Alert variant="info" className="mt-4 mb-0">
                  <small>
                    💡 <strong>Lưu ý:</strong> Vui lòng mang theo thẻ khi đến thư viện mượn sách.
                  </small>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <RegisterLibraryCardModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        onSuccess={handleRegisterSuccess}
      />
    </Container>
  );
};

export default MyLibraryCard;
