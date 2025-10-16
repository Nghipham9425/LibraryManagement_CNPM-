import { Navbar, Container } from "react-bootstrap"
import { FaBook } from "react-icons/fa"
import NotificationBell from "../../Notifications/NotificationBell"

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <FaBook className="me-2" size={24} />
          <span className="fw-bold">Hệ Thống Quản Lý Thư Viện - GROUP 7</span>
        </Navbar.Brand>
        <div className="d-flex align-items-center gap-3">
          <NotificationBell libraryCardId={1} />
          <Navbar.Text className="text-white">
            Xin chào, Quản trị viên
          </Navbar.Text>
        </div>
      </Container>
    </Navbar>
  )
}

export default Header