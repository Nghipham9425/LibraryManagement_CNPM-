import { useState, useEffect } from "react"
import { Modal, Button, Table, Form, Badge, Spinner } from "react-bootstrap"
import { FaPlus, FaEdit, FaTrash, FaBook } from "react-icons/fa"
import { bookItemAPI } from "@/apis"
import { toast } from "react-toastify"

const BookItemsManager = ({ show, onHide, bookId, bookTitle }) => {
  const [bookItems, setBookItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ controlNumber: "", notes: "" })
  const [editFormData, setEditFormData] = useState({ status: 0, notes: "" })

  const loadBookItems = async () => {
    setLoading(true)
    try {
      const data = await bookItemAPI.getAllByBookId(bookId)
      setBookItems(data)
    } catch (error) {
      toast.error("Không thể tải danh sách bản sao")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show && bookId) {
      loadBookItems()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, bookId])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await bookItemAPI.create(bookId, {
        controlNumber: formData.controlNumber || null,
        notes: formData.notes || null,
      })
      toast.success("Thêm bản sao thành công!")
      setShowAddModal(false)
      setFormData({ controlNumber: "", notes: "" })
      loadBookItems()
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể thêm bản sao")
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await bookItemAPI.update(bookId, editingItem.id, {
        status: parseInt(editFormData.status),
        notes: editFormData.notes,
      })
      toast.success("Cập nhật thành công!")
      setShowEditModal(false)
      setEditingItem(null)
      loadBookItems()
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể cập nhật")
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản sao này?")) return
    try {
      await bookItemAPI.delete(bookId, itemId)
      toast.success("Xóa thành công!")
      loadBookItems()
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể xóa")
    }
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setEditFormData({ status: item.status, notes: item.notes })
    setShowEditModal(true)
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      0: { label: "Có sẵn", variant: "success" },
      1: { label: "Đang mượn", variant: "warning" },
      2: { label: "Mất", variant: "danger" },
      3: { label: "Hỏng", variant: "secondary" },
    }
    const s = statusMap[status] || { label: "Không rõ", variant: "dark" }
    return <Badge bg={s.variant}>{s.label}</Badge>
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBook className="me-2" />
            Quản Lý Bản Sao - {bookTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Danh sách bản sao ({bookItems.length})</h6>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              <FaPlus className="me-1" /> Thêm bản sao
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : bookItems.length === 0 ? (
            <div className="text-center text-muted py-4">Chưa có bản sao nào</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Số kiểm soát</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                  <th style={{ width: "120px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookItems.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.controlNumber}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td className="text-muted small">{item.notes || "-"}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal thêm bản sao */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Bản Sao Mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAdd}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Số kiểm soát (để trống để tự động tạo)</Form.Label>
              <Form.Control
                type="text"
                placeholder="VD: 001, 002, ... (hoặc để trống)"
                value={formData.controlNumber}
                onChange={(e) => setFormData({ ...formData, controlNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ghi chú về bản sao này (tùy chọn)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              <FaPlus className="me-1" /> Thêm
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal sửa bản sao */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập Nhật Bản Sao</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEdit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
                <option value="0">Có sẵn</option>
                <option value="1">Đang mượn</option>
                <option value="2">Mất</option>
                <option value="3">Hỏng</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              <FaEdit className="me-1" /> Cập nhật
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default BookItemsManager
