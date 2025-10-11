import { Container } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="bg-light border-top py-3 mt-auto">
      <Container fluid>
        <p className="text-center text-muted mb-0">
          &copy; {new Date().getFullYear()} Hệ Thống Quản Lý Thư Viện. Bản quyền
          thuộc về. Nhóm 7
        </p>
      </Container>
    </footer>
  )
}

export default Footer
