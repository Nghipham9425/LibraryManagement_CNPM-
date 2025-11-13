import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import libraryCardAPI from '../../../apis/libraryCardAPI';

const EditLibraryCardModal = ({ show, onHide, card, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    expiryDate: '',
    status: 0
  });

  useEffect(() => {
    if (card) {
      setFormData({
        studentName: card.studentName || '',
        expiryDate: card.expiryDate ? card.expiryDate.split('T')[0] : '',
        status: card.status
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentName || !formData.expiryDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const updatedCard = await libraryCardAPI.update(card.id, formData);
      onSuccess(updatedCard);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật thẻ thư viện');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sửa thẻ thư viện</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {card && (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mã thẻ</Form.Label>
              <Form.Control
                type="text"
                value={card.cardNumber}
                disabled
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email người dùng</Form.Label>
              <Form.Control
                type="text"
                value={card.email}
                disabled
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tên sinh viên <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Nhập tên sinh viên"
                required
                maxLength={100}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày hết hạn <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value={0}>Hoạt động</option>
                <option value={1}>Không hoạt động</option>
              </Form.Select>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Đang cập nhật...
            </>
          ) : (
            'Cập nhật'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditLibraryCardModal;
