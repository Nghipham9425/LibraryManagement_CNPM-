import React, { useState } from "react"
import { Container, Row, Col, Nav, Button, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FaBook, FaSearch, FaUser, FaBookOpen, FaCube } from "react-icons/fa"

const UserHeader = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white shadow-sm sticky-top">
      <div className="bg-primary text-white py-2">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <FaBookOpen></FaBookOpen>
              <small> Welcome to Huflit library</small>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <small>
                <i className="fas fa-phone-alt me-1"></i> Hotline: 1900-12345 |{" "}
                <i className="fas fa-envelope me-1"></i> library@huflit.com
              </small>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-3">
        <Row className="align-items-center">
          {/* Logo */}
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <Link to="/" className="text-decoration-none d-flex align-items-center justify-content-center justify-content-md-start">
              <FaBook className="text-primary fs-2 me-2" />
              <div>
                <h4 className="mb-0 text-primary fw-bold">Thư Viện HF</h4>
              </div>
            </Link>
          </Col>

          {/* Search Bar */}
          <Col xs={12} md={5} className="mb-3 mb-md-0">
            <Form onSubmit={handleSearch}>
              <div className="position-relative">
                <Form.Control
                  type="search"
                  placeholder="Tìm sách bạn muốn ...."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pe-5"
                  style={{ borderRadius: "25px" }}
                />
                <Button
                  type="submit"
                  variant="link"
                  className="position-absolute end-0 top-50 translate-middle-y text-primary"
                  style={{ border: "none", background: "none" }}
                >
                  <FaSearch />
                </Button>
              </div>
            </Form>
          </Col>

          <Col xs={12} md={4} className="text-center text-md-end">
            <Button
              as={Link}
              to="/login"
              variant="outline-primary"
              className="me-2 rounded-pill"
            >
              <FaUser className="me-1" /> Đăng nhập
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="primary"
              className="rounded-pill"
            >
              Đăng ký
            </Button>
          </Col>
        </Row>
      </Container>
      <div className="bg-light border-top">
        <Container>
          <Nav className="justify-content-center py-2">
            <Nav.Link as={Link} to="/" className="px-3 fw-semibold text-dark">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/books" className="px-3 fw-semibold text-dark">
              Tất cả sách
            </Nav.Link>
            <Nav.Link as={Link} to="/genres" className="px-3 fw-semibold text-dark">
              Thể loại
            </Nav.Link>
            <Nav.Link as={Link} to="/authors" className="px-3 fw-semibold text-dark">
              Tác giả
            </Nav.Link>
            <Nav.Link as={Link} to="/library-3d" className="px-3 fw-semibold text-primary">
              <FaCube className="me-1" /> Thư Viện 3D
            </Nav.Link>
            <Nav.Link as={Link} to="/library-info" className="px-3 fw-semibold text-dark">
              Thông tin thư viện
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="px-3 fw-semibold text-dark">
              Liên hệ
            </Nav.Link>
          </Nav>
        </Container>
      </div>
    </header>
  )
}

export default UserHeader
