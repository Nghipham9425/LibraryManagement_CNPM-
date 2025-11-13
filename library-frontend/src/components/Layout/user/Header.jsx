import React, { useState } from "react"
import { Container, Row, Col, Nav, Button, Form, Dropdown } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FaBook, FaSearch, FaUser, FaBookOpen, FaCube, FaSignOutAlt, FaUserCircle, FaExchangeAlt } from "react-icons/fa"
import { useAuth } from "@/contexts/AuthContext"
import NotificationBell from "../../Notifications/NotificationBell"

const UserHeader = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('') // Clear search after navigate
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
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
            {user ? (
              <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3">
                <NotificationBell libraryCardId={user?.id || 1} />
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" className="rounded-pill">
                    <FaUserCircle className="me-1" /> {user.userName}
                  </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item disabled>
                    <strong>{user.userName}</strong><br />
                    <small className="text-muted">{user.email}</small>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" /> Hồ sơ cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/borrowing">
                    Sách đang mượn
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" /> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              </div>
            ) : (
              <>
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
              </>
            )}
          </Col>
        </Row>
      </Container>
      <div className="bg-light border-top">
        <Container>
          <Nav className="justify-content-center py-2">
            <Nav.Link as={Link} to="/" className="px-3 fw-semibold text-dark nav-link-hover">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/books" className="px-3 fw-semibold text-dark nav-link-hover">
              Tất cả sách
            </Nav.Link>
            <Nav.Link as={Link} to="/genres" className="px-3 fw-semibold text-dark nav-link-hover">
              Thể loại
            </Nav.Link>
            <Nav.Link as={Link} to="/authors" className="px-3 fw-semibold text-dark nav-link-hover">
              Tác giả
            </Nav.Link>
            <Nav.Link as={Link} to="/borrowing" className="px-3 fw-semibold text-success nav-link-hover">
              <FaExchangeAlt className="me-1" /> Mượn sách
            </Nav.Link>
            <Nav.Link as={Link} to="/library-3d" className="px-3 fw-semibold text-primary nav-link-hover">
              <FaCube className="me-1" /> Thư Viện 3D
            </Nav.Link>
            <Nav.Link as={Link} to="/library-info" className="px-3 fw-semibold text-dark nav-link-hover">
              Thông tin thư viện
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="px-3 fw-semibold text-dark nav-link-hover">
              Liên hệ
            </Nav.Link>
          </Nav>
        </Container>
      </div>
    </header>
  )
}

export default UserHeader
