import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import libraryCardAPI from '../../../apis/libraryCardAPI';
import { userAPI } from '../../../apis/index';

const CreateLibraryCardModal = ({ show, onHide, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    studentName: '',
    expiryDate: '',
  });

  useEffect(() => {
    if (show) {
      fetchUsers();
      // Set default expiry date to 1 year from now
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      setFormData(prev => ({
        ...prev,
        expiryDate: oneYearLater.toISOString().split('T')[0]
      }));
    }
  }, [show]);

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAll();
      // Filter out users who are not "User" role
      const regularUsers = data.filter(user => user.role === 'User');
      setUsers(regularUsers);
    } catch {
      setError('Không thể tải danh sách người dùng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill student name from selected user
    if (name === 'userId') {
      const selectedUser = users.find(u => u.id === parseInt(value));
      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          studentName: selectedUser.fullName || ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.userId || !formData.studentName || !formData.expiryDate) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      const newCard = await libraryCardAPI.create({
        userId: parseInt(formData.userId),
        studentName: formData.studentName,
        expiryDate: formData.expiryDate
      });
      onSuccess(newCard);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo thẻ thư viện');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      studentName: '',
      expiryDate: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo thẻ thư viện mới</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Chọn người dùng <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn người dùng --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </Form.Select>
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
              min={new Date().toISOString().split('T')[0]}
            />
            <Form.Text className="text-muted">
              Mặc định: 1 năm kể từ hôm nay
            </Form.Text>
          </Form.Group>
        </Form>
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
              Đang tạo...
            </>
          ) : (
            'Tạo thẻ'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateLibraryCardModal;
