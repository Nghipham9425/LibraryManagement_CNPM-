import { Form, Row, Col } from "react-bootstrap"

const BookSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <Row className="mb-3">
      <Col md={6}>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Col>
    </Row>
  )
}

export default BookSearch
