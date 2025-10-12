import { Navbar, Container } from "react-bootstrap"
import { FaBook } from "react-icons/fa"

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <FaBook className="me-2" size={24} />
          <span className="fw-bold">Hệ Thống Quản Lý Thư Viện - GROUP 7</span>
        </Navbar.Brand>
        <Navbar.Text className="text-white">
          Xin chào, Quản trị viên
        </Navbar.Text>
      </Container>
    </Navbar>
  )
}

export default Header
