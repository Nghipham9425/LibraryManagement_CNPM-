import { Form, Row, Col, Button, Accordion } from "react-bootstrap"
import { FaSearch, FaFilter, FaUndo } from "react-icons/fa"

const BookSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedGenre, 
  setSelectedGenre, 
  selectedAuthor, 
  setSelectedAuthor,
  availableOnly,
  setAvailableOnly,
  sortBy,
  setSortBy,
  genres = [],
  authors = []
}) => {
  const handleReset = () => {
    setSearchTerm("")
    setSelectedGenre("")
    setSelectedAuthor("")
    setAvailableOnly(false)
    setSortBy("title")
  }

  return (
    <div className="mb-4">
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="🔍 Tìm kiếm sách theo tên hoặc tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </Col>
        <Col md={4}>
          <Button variant="outline-secondary" className="w-100" onClick={handleReset} size="lg">
            <FaUndo className="me-2" />
            Đặt lại bộ lọc
          </Button>
        </Col>
      </Row>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <FaFilter className="me-2" />
            <strong>Bộ Lọc Nâng Cao</strong>
          </Accordion.Header>
          <Accordion.Body>
            <Row className="g-3">
              {/* Thể loại */}
              <Col md={3}>
                <Form.Label className="fw-bold small">Thể Loại</Form.Label>
                <Form.Select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">Tất cả thể loại</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.name}>
                      {genre.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Tác giả */}
              <Col md={4}>
                <Form.Label className="fw-bold small">Tác Giả</Form.Label>
                <Form.Select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                >
                  <option value="">Tất cả tác giả</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.name}>
                      {author.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Sắp xếp */}
              <Col md={4}>
                <Form.Label className="fw-bold small">Sắp Xếp Theo</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="title">Tên sách (A-Z)</option>
                  <option value="title-desc">Tên sách (Z-A)</option>
                  <option value="year-desc">Năm mới nhất</option>
                  <option value="year-asc">Năm cũ nhất</option>
                  <option value="available">Còn nhiều sách nhất</option>
                </Form.Select>
              </Col>

              {/* Checkbox chỉ hiện sách còn */}
              <Col md={1} className="d-flex align-items-end">
                <Form.Check
                  type="checkbox"
                  label={<small className="fw-bold">Còn sách</small>}
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default BookSearch
