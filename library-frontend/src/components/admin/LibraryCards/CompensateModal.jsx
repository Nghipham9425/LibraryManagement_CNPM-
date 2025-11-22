import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import libraryCardAPI from '../../../apis/libraryCardAPI';

const CompensateModal = ({ show, onHide, card, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [finesData, setFinesData] = useState(null);
  const [loadingFines, setLoadingFines] = useState(false);

  useEffect(() => {
    const fetchFines = async () => {
      if (show && card) {
        setLoadingFines(true);
        try {
          const data = await libraryCardAPI.getUnpaidFines(card.id);
          setFinesData(data);
          setAmount(data.totalAmount.toString());
        } catch (err) {
          console.error('Error fetching fines:', err);
        } finally {
          setLoadingFines(false);
        }
      }
    };
    fetchFines();
  }, [show, card]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền bồi thường hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const updatedCard = await libraryCardAPI.compensate(card.id, {
        amount: parseFloat(amount),
        notes: notes.trim()
      });
      onSuccess(updatedCard);
      // Reset form
      setAmount('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xử lý bồi thường');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setNotes('');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xử lý bồi thường</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {card && (
          <div className="mb-3">
            <p><strong>Thẻ:</strong> {card.cardNumber}</p>
            <p><strong>Sinh viên:</strong> {card.studentName}</p>
            <p><strong>Email:</strong> {card.email}</p>
          </div>
        )}

        {loadingFines ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" /> Đang tải thông tin phạt...
          </div>
        ) : finesData && (
          <Alert variant="warning" className="mb-3">
            <h6 className="mb-2">📋 Danh sách phạt chưa thanh toán:</h6>
            {finesData.fines.map((fine, idx) => (
              <div key={fine.id} className="mb-1">
                <small>
                  {idx + 1}. <strong>{fine.bookTitle}</strong> - {fine.reason === 'Lost' ? 'Mất sách' : 'Hỏng sách'}: {fine.amount.toLocaleString('vi-VN')} VND
                </small>
              </div>
            ))}
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center">
              <strong>Tổng cộng:</strong>
              <strong className="text-danger fs-5">{finesData.totalAmount.toLocaleString('vi-VN')} VND</strong>
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Số tiền bồi thường (VND) <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              step="1000"
              min="0"
              placeholder="Nhập số tiền"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              readOnly
              disabled
              className="bg-light"
            />
            <Form.Text className="text-muted">
              Số tiền bồi thường phải bằng tổng tiền phạt chưa thanh toán
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ghi chú về bồi thường (tùy chọn)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Form.Text className="text-muted">
              VD: Bồi thường sách bị mất/hỏng, tên sách, ngày xử lý...
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Xác nhận bồi thường'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompensateModal;
