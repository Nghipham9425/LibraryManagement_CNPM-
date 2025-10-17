import { useState, useEffect } from "react"
import { Card, Button, Container, Table, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap"
import { FaTags, FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import { genreAPI } from "../../../apis"
import { toast } from 'react-toastify'

const Genres = () => {
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingGenre, setEditingGenre] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState([])

  useEffect(() => { loadGenres() }, [])

  const loadGenres = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await genreAPI.getAll()
      setGenres(data)
    } catch (err) {
      setError("Không thể tải danh sách thể loại")
      console.error("Error loading genres:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleShowModal = (genre = null) => {
    setEditingGenre(genre)
    setFormData(genre ? { name: genre.name, description: genre.description || "" } : { name: "", description: "" })
    setFormErrors([])
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingGenre(null)
    setFormData({ name: "", description: "" })
    setFormErrors([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors([])
    try {
      editingGenre ? await genreAPI.update(editingGenre.id, formData) : await genreAPI.create(formData)
      await loadGenres()
      handleCloseModal()
      toast.success(editingGenre ? "Cập nhật thể loại thành công!" : "Thêm thể loại thành công!")
    } catch (err) {
      setFormErrors(err.response?.data?.errors || [])
      toast.error(editingGenre ? "Không thể cập nhật thể loại" : "Không thể thêm thể loại")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) return
    try {
      await genreAPI.delete(id)
      await loadGenres()
      toast.success("Xóa thể loại thành công!")
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0] || "Không thể xóa thể loại")
    }
  }

  if (loading) return <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}><Spinner animation="border" variant="primary" /></Container>

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Thể Loại</h2>
          <p className="text-muted mb-0">Quản lý danh sách thể loại sách trong thư viện</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center text-white" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" /> Thêm Thể Loại
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {genres.length === 0 ? (
            <div className="text-center py-5">
              <FaTags size={64} className="text-muted mb-3" />
              <h5 className="fw-bold">Chưa Có Thể Loại</h5>
              <p className="text-muted">Bắt đầu bằng cách thêm thể loại đầu tiên vào thư viện.</p>
              <Button variant="outline-primary" className="mt-2 text-primary" onClick={() => handleShowModal()}>
                <FaPlus className="me-2" /> Thêm Thể Loại Đầu Tiên
              </Button>
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr><th>ID</th><th>Tên Thể Loại</th><th>Mô Tả</th><th>Số Sách</th><th>Thao Tác</th></tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr key={genre.id}>
                    <td>{genre.id}</td>
                    <td className="fw-semibold">{genre.name}</td>
                    <td>{genre.description || "Không có mô tả"}</td>
                    <td><Badge bg="secondary">{genre.bookCount || 0} sách</Badge></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(genre)}><FaEdit /></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(genre.id)}><FaTrash /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingGenre ? "Chỉnh Sửa Thể Loại" : "Thêm Thể Loại Mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formErrors.length > 0 && <Alert variant="danger"><ul className="mb-0">{formErrors.map((error, index) => <li key={index}>{error}</li>)}</ul></Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Tên Thể Loại *</Form.Label>
              <Form.Control type="text" placeholder="Nhập tên thể loại" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={saving} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả thể loại (tùy chọn)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={saving} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>Hủy</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <><Spinner animation="border" size="sm" className="me-2" />{editingGenre ? "Đang Cập Nhật..." : "Đang Thêm..."}</> : editingGenre ? "Cập Nhật" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Genres
