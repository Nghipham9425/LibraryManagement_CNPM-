import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSync, FaMoneyBillWave } from 'react-icons/fa';
import libraryCardAPI from '../../../apis/libraryCardAPI';
import CreateLibraryCardModal from './CreateLibraryCardModal';
import EditLibraryCardModal from './EditLibraryCardModal';
import CompensateModal from './CompensateModal';
import Pagination from '../../Pagination';
import usePagination from '../../../hooks/usePagination';

const LibraryCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompensateModal, setShowCompensateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Pagination
  const { currentPage, totalPages, currentItems, goToPage, totalItems, startIndex, endIndex } = 
    usePagination(cards, 10); // 10 items per page

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await libraryCardAPI.getAll();
      setCards(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách thẻ thư viện');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thẻ thư viện này?')) {
      return;
    }

    try {
      await libraryCardAPI.delete(id);
      setCards(cards.filter(card => card.id !== id));
      alert('Xóa thẻ thư viện thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa thẻ thư viện');
    }
  };

  const handleRenew = async (id) => {
    try {
      const renewed = await libraryCardAPI.renew(id, 12); // Renew for 12 months
      setCards(cards.map(card => card.id === id ? renewed : card));
      alert('Gia hạn thẻ thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể gia hạn thẻ');
    }
  };

  const handleEdit = (card) => {
    setSelectedCard(card);
    setShowEditModal(true);
  };

  const handleCreateSuccess = (newCard) => {
    setCards([newCard, ...cards]);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedCard) => {
    setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
    setShowEditModal(false);
  };

  const handleCompensate = (card) => {
    setSelectedCard(card);
    setShowCompensateModal(true);
  };

  const handleCompensateSuccess = (updatedCard) => {
    setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
    setShowCompensateModal(false);
    alert('Xử lý bồi thường thành công! Thẻ đã được kích hoạt lại.');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getStatusBadge = (status, expiryDate) => {
    if (status === 1) { // Inactive
      return <Badge bg="secondary">Không hoạt động</Badge>;
    }
    if (isExpired(expiryDate)) {
      return <Badge bg="danger">Hết hạn</Badge>;
    }
    return <Badge bg="success">Hoạt động</Badge>;
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

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý thẻ thư viện</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" />
          Tạo thẻ mới
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {cards.length > 0 && (
        <div className="mb-3 text-muted">
          Hiển thị {startIndex} - {endIndex} của {totalItems} thẻ
        </div>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Mã thẻ</th>
            <th>Tên sinh viên</th>
            <th>Email</th>
            <th>Ngày tạo</th>
            <th>Ngày hết hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cards.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Chưa có thẻ thư viện nào
              </td>
            </tr>
          ) : (
            currentItems.map(card => (
              <tr key={card.id}>
                <td><strong>{card.cardNumber}</strong></td>
                <td>{card.studentName}</td>
                <td>{card.email}</td>
                <td>{formatDate(card.createdAt)}</td>
                <td>
                  {formatDate(card.expiryDate)}
                  {isExpired(card.expiryDate) && (
                    <span className="text-danger ms-2">(Đã hết hạn)</span>
                  )}
                </td>
                <td>{getStatusBadge(card.status, card.expiryDate)}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(card)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleRenew(card.id)}
                  >
                    <FaSync />
                  </Button>
                  {card.status === 1 && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleCompensate(card)}
                      title="Xử lý bồi thường"
                    >
                      <FaMoneyBillWave />
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />

      <CreateLibraryCardModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditLibraryCardModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        card={selectedCard}
        onSuccess={handleEditSuccess}
      />

      <CompensateModal
        show={showCompensateModal}
        onHide={() => setShowCompensateModal(false)}
        card={selectedCard}
        onSuccess={handleCompensateSuccess}
      />
    </Container>
  );
};

export default LibraryCards;
