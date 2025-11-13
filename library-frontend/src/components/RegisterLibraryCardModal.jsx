import { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import libraryCardAPI from '../apis/libraryCardAPI';
import { toast } from 'react-toastify';

const RegisterLibraryCardModal = ({ show, onHide, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!studentName.trim()) {
      setError('Vui lòng nhập tên sinh viên');
      return;
    }

    try {
      setLoading(true);
      const newCard = await libraryCardAPI.register({ studentName: studentName.trim() });
      toast.success('Đăng ký thẻ thư viện thành công!');
      onSuccess(newCard);
      setStudentName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đăng ký thẻ thư viện');
      toast.error(err.response?.data?.message || 'Không thể đăng ký thẻ thư viện');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStudentName('');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đăng ký thẻ thư viện</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Alert variant="info">
            <small>
              📋 <strong>Lưu ý:</strong> Thẻ thư viện sẽ có hiệu lực 1 năm kể từ ngày đăng ký.
              Bạn cần có thẻ thư viện để có thể mượn sách.
            </small>
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label>
              Tên sinh viên <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nhập tên đầy đủ của bạn"
              required
              maxLength={100}
              disabled={loading}
              autoFocus
            />
            <Form.Text className="text-muted">
              Vui lòng nhập tên chính xác như trong hồ sơ sinh viên
            </Form.Text>
          </Form.Group>

          <div className="bg-light p-3 rounded">
            <h6 className="mb-2">Thông tin thẻ sẽ được cấp:</h6>
            <ul className="mb-0 small">
              <li>Mã thẻ tự động: LIB000XXX</li>
              <li>Thời hạn: 1 năm (có thể gia hạn)</li>
              <li>Trạng thái: Hoạt động</li>
              <li>Số sách được mượn tối đa: 3 cuốn cùng lúc</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
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
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký thẻ'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RegisterLibraryCardModal;
