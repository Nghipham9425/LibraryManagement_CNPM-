import { Modal, Form, Row, Col, Button, Image, Badge } from "react-bootstrap"
import { toast } from "react-toastify"
import {
  FaBook,
  FaUser,
  FaBarcode,
  FaTag,
  FaCalendar,
  FaBuilding,
  FaImage,
} from "react-icons/fa"

const BookFormModal = ({
  show,
  onHide,
  editingBook,
  formData,
  setFormData,
  onSubmit,
  authors = [],
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAuthorChange = (selectedAuthorIds) => {
    setFormData({ ...formData, authorIds: selectedAuthorIds })
  }

  const toggleAuthor = (authorId) => {
    const currentIds = formData.authorIds || []
    if (currentIds.includes(authorId)) {
      handleAuthorChange(currentIds.filter(id => id !== authorId))
    } else {
      handleAuthorChange([...currentIds, authorId])
    }
  }

  const selectedAuthors = authors.filter(author => formData.authorIds?.includes(author.id))

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <FaBook className="me-2" />
          {editingBook ? "Sửa Sách" : "Thêm Sách Mới"}
        </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          // Validate authors
          if (!formData.authorIds || formData.authorIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất một tác giả")
            return
          }
          onSubmit(formData)
        }}
      >
        <Modal.Body className="p-4">
          <Row>
            <Col md={8}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaBook className="me-2 text-primary" />
                      Tên Sách *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      maxLength="255"
                      placeholder="Nhập tên sách"
                    />
                    <Form.Control.Feedback type="invalid">
                      Vui lòng nhập tên sách.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaUser className="me-2 text-primary" />
                      Tác Giả *
                    </Form.Label>
                    <div className="border rounded p-2" style={{ minHeight: '120px', maxHeight: '200px', overflowY: 'auto' }}>
                      {authors.length === 0 ? (
                        <div className="text-muted text-center py-3">
                          <small>Chưa có tác giả nào. Vui lòng thêm tác giả trước.</small>
                        </div>
                      ) : (
                        authors.map((author) => (
                          <Form.Check
                            key={author.id}
                            type="checkbox"
                            id={`author-${author.id}`}
                            label={author.name}
                            checked={formData.authorIds?.includes(author.id) || false}
                            onChange={() => toggleAuthor(author.id)}
                            className="mb-2"
                          />
                        ))
                      )}
                    </div>
                    {selectedAuthors.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">Đã chọn: </small>
                        {selectedAuthors.map((author) => (
                          <Badge key={author.id} bg="secondary" className="me-1 mb-1">
                            {author.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Form.Control.Feedback type="invalid">
                      Vui lòng chọn ít nhất một tác giả.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaBarcode className="me-2 text-primary" />
                      ISBN
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      maxLength="20"
                      placeholder="Nhập ISBN"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaTag className="me-2 text-primary" />
                      Thể Loại
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      maxLength="100"
                      placeholder="Nhập thể loại"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaCalendar className="me-2 text-primary" />
                      Năm Xuất Bản
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="publicationYear"
                      value={formData.publicationYear}
                      onChange={handleChange}
                      placeholder="Nhập năm xuất bản"
                      min="1000"
                      max={new Date().getFullYear()}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center">
                      <FaBuilding className="me-2 text-primary" />
                      Nhà Xuất Bản
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      maxLength="255"
                      placeholder="Nhập nhà xuất bản"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaImage className="me-2 text-primary" />
                  URL Ảnh Bìa
                </Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleChange}
                  placeholder="Nhập URL ảnh bìa sách (tùy chọn)"
                  maxLength="512"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaBook className="me-2 text-primary" />
                  Mô Tả
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Nhập mô tả sách (tùy chọn)"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="text-center">
              <div className="mb-3">
                <strong>Ảnh Bìa</strong>
              </div>
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fluid
                  rounded
                  style={{ maxHeight: 250, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "" // Hide if invalid
                    e.target.style.display = "none"
                  }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center rounded"
                  style={{ height: 250 }}
                >
                  <span className="text-muted">Không có ảnh</span>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light">
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
