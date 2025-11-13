import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form, Alert, Spinner } from 'react-bootstrap'
import { FaUser, FaEnvelope, FaIdCard, FaEdit, FaKey, FaSignOutAlt, FaBriefcase, FaCalendar, FaPhone, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa'
import { useAuth } from '../../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { userAPI } from '../../../apis'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [editData, setEditData] = useState({ email: '', fullName: '', phone: '', address: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadUserInfo() }, [])

  const loadUserInfo = async () => {
    try {
      setLoading(true)
      const data = await userAPI.getMe()
      setUserInfo(data)
      setEditData({ 
        email: data.email || '', 
        fullName: data.fullName || '', 
        phone: data.phone || '',
        address: data.address || ''
      })
    } catch {
      toast.error('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleShowEditModal = () => setShowEditModal(true)
  const handleCloseEditModal = () => setShowEditModal(false)
  const handleShowPasswordModal = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordModal(true)
  }
  const handleClosePasswordModal = () => setShowPasswordModal(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userAPI.updateMe(editData)
      await loadUserInfo()
      handleCloseEditModal()
      toast.success('Cập nhật thông tin thành công!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể cập nhật thông tin')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!')
      return
    }
    setSaving(true)
    try {
      await userAPI.changePassword(passwordData.currentPassword, passwordData.newPassword)
      handleClosePasswordModal()
      toast.success('Đổi mật khẩu thành công!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể đổi mật khẩu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  )

  if (!userInfo) return <Container><Alert variant="danger">Không tìm thấy thông tin người dùng</Alert></Container>

  return (
    <Container fluid className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <FaUser size={48} className="mb-2" />
              <h2 className="h4 mb-0">Thông Tin Cá Nhân</h2>
            </Card.Header>
            <Card.Body className="p-4">
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaUser className="me-2 text-primary" /><strong>Tên đăng nhập</strong></div>
                  <span>{userInfo.userName}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaEnvelope className="me-2 text-primary" /><strong>Email</strong></div>
                  <span>{userInfo.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaUser className="me-2 text-primary" /><strong>Họ tên</strong></div>
                  <span>{userInfo.fullName || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaPhone className="me-2 text-primary" /><strong>Số điện thoại</strong></div>
                  <span>{userInfo.phone || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaMapMarkerAlt className="me-2 text-primary" /><strong>Địa chỉ</strong></div>
                  <span>{userInfo.address || '-'}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaIdCard className="me-2 text-primary" /><strong>Vai trò</strong></div>
                  <span className={`badge bg-${userInfo.role === 'Admin' ? 'danger' : userInfo.role === 'Librarian' ? 'primary' : 'success'}`}>
                    {userInfo.role}
                  </span>
                </ListGroup.Item>
                {(userInfo.role === 'Admin' || userInfo.role === 'Librarian') && (
                  <>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                      <div><FaBriefcase className="me-2 text-primary" /><strong>Phòng ban</strong></div>
                      <span>{userInfo.department || '-'}</span>
                    </ListGroup.Item>
                    {userInfo.hireDate && (
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                        <div><FaCalendar className="me-2 text-primary" /><strong>Ngày vào làm</strong></div>
                        <span>{new Date(userInfo.hireDate).toLocaleDateString('vi-VN')}</span>
                      </ListGroup.Item>
                    )}
                  </>
                )}
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div><FaCalendar className="me-2 text-primary" /><strong>Ngày tạo tài khoản</strong></div>
                  <span>{new Date(userInfo.createdAt).toLocaleDateString('vi-VN')}</span>
                </ListGroup.Item>
              </ListGroup>

              <div className="d-flex gap-2 justify-content-center flex-wrap">
                {userInfo.role !== 'Admin' && userInfo.role !== 'Librarian' && (
                  <Button variant="success" onClick={() => navigate('/my-library-card')}>
                    <FaCreditCard className="me-2" />Thẻ Thư Viện
                  </Button>
                )}
                <Button variant="primary" onClick={handleShowEditModal}><FaEdit className="me-2" />Cập Nhật Thông Tin</Button>
                <Button variant="warning" onClick={handleShowPasswordModal}><FaKey className="me-2" />Đổi Mật Khẩu</Button>
                <Button variant="outline-danger" onClick={logout}><FaSignOutAlt className="me-2" />Đăng Xuất</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cập Nhật Thông Tin</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProfile}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} required disabled={saving} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control type="text" value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} disabled={saving} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} disabled={saving} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control as="textarea" rows={2} value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} disabled={saving} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal} disabled={saving}>Hủy</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <><Spinner animation="border" size="sm" className="me-2" />Đang lưu...</> : 'Lưu'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showPasswordModal} onHide={handleClosePasswordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đổi Mật Khẩu</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại *</Form.Label>
              <Form.Control type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required disabled={saving} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới *</Form.Label>
              <Form.Control type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required minLength={6} disabled={saving} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới *</Form.Label>
              <Form.Control type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required minLength={6} disabled={saving} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePasswordModal} disabled={saving}>Hủy</Button>
            <Button variant="warning" type="submit" disabled={saving}>
              {saving ? <><Spinner animation="border" size="sm" className="me-2" />Đang lưu...</> : 'Đổi Mật Khẩu'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Profile
