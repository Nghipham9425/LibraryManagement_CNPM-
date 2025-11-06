import { useState, useEffect } from "react"
import { Card, Button, Container, Table, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap"
import { FaPlus, FaUsers, FaEdit, FaBan, FaCheck, FaKey } from "react-icons/fa"
import { userAPI } from "../../../apis"
import { toast } from "react-toastify"

const Members = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ userName: "", email: "", password: "", fullName: "", phone: "", role: "Reader", department: "" })
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState([])

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userAPI.getAll()
      setUsers(data)
    } catch {
      setError("Không thể tải danh sách người dùng")
    } finally {
      setLoading(false)
    }
  }

  const handleShowModal = (user = null) => {
    setEditingUser(user)
    setFormData(user ? { userName: user.userName, email: user.email, password: "", fullName: user.fullName || "", phone: user.phone || "", role: user.role, department: user.department || "" } : { userName: "", email: "", password: "", fullName: "", phone: "", role: "Reader", department: "" })
    setFormErrors([])
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setFormData({ userName: "", email: "", password: "", fullName: "", phone: "", role: "Reader", department: "" })
    setFormErrors([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors([])
    try {
      const data = { email: formData.email, fullName: formData.fullName || null, phone: formData.phone || null, role: formData.role, department: formData.role === "Reader" ? null : (formData.department || null) }
      if (editingUser) {
        await userAPI.update(editingUser.id, data)
        toast.success("Cập nhật thành công!")
      } else {
        data.userName = formData.userName
        data.password = formData.password
        await userAPI.create(data)
        toast.success("Thêm người dùng thành công!")
      }
      await loadUsers()
      handleCloseModal()
    } catch (err) {
      setFormErrors(err.response?.data?.errors || [err.response?.data?.message || "Có lỗi xảy ra"])
      toast.error(editingUser ? "Không thể cập nhật" : "Không thể thêm người dùng")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id, isActive) => {
    if (!isActive && !window.confirm("Vô hiệu hóa người dùng này?")) return
    try {
      isActive ? await userAPI.delete(id) : await userAPI.activate(id)
      await loadUsers()
      toast.success(isActive ? "Vô hiệu hóa thành công!" : "Kích hoạt thành công!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra")
    }
  }

  const handleChangePassword = async (user) => {
    if (user.role === "Reader") {
      toast.error("Chỉ Admin và Librarian mới có thể đổi password ở đây")
      return
    }
    const newPassword = prompt(`Nhập mật khẩu mới cho ${user.userName} (tối thiểu 6 ký tự):`)
    if (!newPassword || newPassword.length < 6) {
      if (newPassword) toast.error("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }
    try {
      await userAPI.changePasswordAdmin(user.id, newPassword)
      toast.success("Đổi mật khẩu thành công!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể đổi mật khẩu")
    }
  }

  const getRoleBadge = (role) => ({ Admin: "danger", Librarian: "primary", Reader: "success" }[role] || "secondary")

  if (loading) return <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}><Spinner animation="border" variant="primary" /></Container>

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Người Dùng</h2>
          <p className="text-muted mb-0">Quản lý tài khoản người dùng hệ thống</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center text-white" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" /> Thêm Người Dùng
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {users.length === 0 ? (
            <div className="text-center py-5">
              <FaUsers size={64} className="text-muted mb-3" />
              <h5 className="fw-bold">Chưa Có Người Dùng</h5>
              <p className="text-muted">Bắt đầu bằng cách thêm người dùng đầu tiên.</p>
              <Button variant="outline-primary" className="mt-2 text-primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-2" /> Thêm Người Dùng Đầu Tiên
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr><th>ID</th><th>Tên đăng nhập</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Thao Tác</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="fw-semibold">{user.userName}</td>
                    <td>{user.email}</td>
                    <td><Badge bg={getRoleBadge(user.role)}>{user.role}</Badge></td>
                    <td><Badge bg={user.isActive ? "success" : "secondary"}>{user.isActive ? "Hoạt động" : "Vô hiệu hóa"}</Badge></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleShowModal(user)}><FaEdit /></Button>
                      <Button variant={user.isActive ? "outline-danger" : "outline-success"} size="sm" className="me-1" onClick={() => handleToggleActive(user.id, user.isActive)}>
                        {user.isActive ? <FaBan /> : <FaCheck />}
                      </Button>
                      {(user.role === "Admin" || user.role === "Librarian") && (
                        <Button variant="outline-warning" size="sm" onClick={() => handleChangePassword(user)}><FaKey /></Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng Mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formErrors.length > 0 && <Alert variant="danger"><ul className="mb-0">{formErrors.map((error, index) => <li key={index}>{error}</li>)}</ul></Alert>}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tên đăng nhập *</Form.Label>
                  <Form.Control type="text" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} required disabled={!!editingUser || saving} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={saving} />
                </Form.Group>
              </div>
            </div>
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu *</Form.Label>
                <Form.Control type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required disabled={saving} minLength={6} />
              </Form.Group>
            )}
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} disabled={saving} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} disabled={saving} />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Vai trò *</Form.Label>
                  <Form.Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required disabled={saving}>
                    <option value="Reader">Reader</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Admin">Admin</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {(formData.role === "Admin" || formData.role === "Librarian") && (
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Phòng ban *</Form.Label>
                    <Form.Control type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required disabled={saving} />
                  </Form.Group>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>Hủy</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <><Spinner animation="border" size="sm" className="me-2" />{editingUser ? "Đang Cập Nhật..." : "Đang Thêm..."}</> : editingUser ? "Cập Nhật" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Members