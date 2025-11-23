import { useState, useEffect } from "react"
import {
  Card,
  Button,
  Container,
  Table,
  Modal,
  Form,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap"
import { FaUsers, FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import { authorAPI } from "../../../apis"
import { toast } from 'react-toastify'
import { useAuth } from "../../../contexts/AuthContext"

const Authors = () => {
  const { user } = useAuth()
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState(null)
  const [formData, setFormData] = useState({ name: "" })
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState([])

  useEffect(() => {
    loadAuthors()
  }, [])

  const loadAuthors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await authorAPI.getAll()
      setAuthors(data)
    } catch (err) {
      setError("Không thể tải danh sách tác giả")
      console.error("Error loading authors:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleShowModal = (author = null) => {
    if (author) {
      setEditingAuthor(author)
      setFormData({ name: author.name })
    } else {
      setEditingAuthor(null)
      setFormData({ name: "" })
    }
    setFormErrors([])
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAuthor(null)
    setFormData({ name: "" })
    setFormErrors([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors([])

    try {
      if (editingAuthor) {
        await authorAPI.update(editingAuthor.id, formData)
      } else {
        await authorAPI.create(formData)
      }
      await loadAuthors()
      handleCloseModal()
      toast.success(editingAuthor ? "Cập nhật tác giả thành công!" : "Thêm tác giả thành công!")
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors)
      } else {
        toast.error(editingAuthor ? "Không thể cập nhật tác giả" : "Không thể thêm tác giả")
      }
      console.error("Error saving author:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tác giả này?")) {
      return
    }

    try {
      await authorAPI.delete(id)
      await loadAuthors()
      toast.success("Xóa tác giả thành công!")
    } catch (err) {
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        toast.error(err.response.data.errors[0])
      } else {
        toast.error("Không thể xóa tác giả")
      }
      console.error("Error deleting author:", err)
    }
  }

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Tác Giả</h2>
          <p className="text-muted mb-0">
            Quản lý danh sách tác giả trong thư viện
          </p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center text-white"
          onClick={() => handleShowModal()}
        >
          <FaPlus className="me-2" />
          Thêm Tác Giả
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {authors.length === 0 ? (
            <div className="text-center py-5">
              <FaUsers size={64} className="text-muted mb-3" />
              <h5 className="fw-bold">Chưa Có Tác Giả</h5>
              <p className="text-muted">
                Bắt đầu bằng cách thêm tác giả đầu tiên vào thư viện.
              </p>
              <Button
                variant="outline-primary"
                className="mt-2 text-primary"
                onClick={() => handleShowModal()}
              >
                <FaPlus className="me-2" />
                Thêm Tác Giả Đầu Tiên
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Tên Tác Giả</th>
                  <th>Số Sách</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id}>
                    <td>{author.id}</td>
                    <td className="fw-semibold">{author.name}</td>
                    <td>
                      <Badge bg="secondary">
                        {author.bookCount || 0} sách
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(author)}
                      >
                        <FaEdit />
                      </Button>
                      {/* Chỉ Admin mới có quyền xóa tác giả */}
                      {user?.role === 'Admin' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(author.id)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal for Add/Edit Author */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAuthor ? "Chỉnh Sửa Tác Giả" : "Thêm Tác Giả Mới"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formErrors.length > 0 && (
              <Alert variant="danger">
                <ul className="mb-0">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Tên Tác Giả *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên tác giả"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={saving}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {editingAuthor ? "Đang Cập Nhật..." : "Đang Thêm..."}
                </>
              ) : (
                editingAuthor ? "Cập Nhật" : "Thêm"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Authors
