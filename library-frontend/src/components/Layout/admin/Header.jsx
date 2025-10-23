import { Navbar, Container, Button } from "react-bootstrap"
import { FaBook, FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import NotificationBell from "../../Notifications/NotificationBell"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/auth')
  }

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
            Xin chào, {user?.userName || 'Admin'}
          </Navbar.Text>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            <FaSignOutAlt className="me-1" />
            Đăng xuất
          </Button>
        </div>
      </Container>
    </Navbar>
  )
}

export default Header