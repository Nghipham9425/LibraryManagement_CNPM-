import { Modal, Form, Row, Col, Button } from "react-bootstrap"

const BookFormModal = ({
  show,
  onHide,
  editingBook,
  formData,
  setFormData,
  onSubmit,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingBook ? "Sửa Sách" : "Thêm Sách Mới"}</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(formData)
        }}
      >
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tên Sách *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength="255"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tác Giả *</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  maxLength="255"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  maxLength="20"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Thể Loại</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  maxLength="100"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Năm Xuất Bản</Form.Label>
                <Form.Control
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nhà Xuất Bản</Form.Label>
                <Form.Control
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  maxLength="255"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>URL Ảnh Bìa</Form.Label>
            <Form.Control
              type="url"
              name="imageUrl"
              value={formData.imageUrl || ""}
              onChange={handleChange}
              placeholder="Nhập URL ảnh bìa sách (tùy chọn)"
              maxLength="512"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            {editingBook ? "Cập Nhật" : "Thêm"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default BookFormModal
