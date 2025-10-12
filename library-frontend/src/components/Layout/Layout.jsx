import { Container, Row, Col } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

const Layout = () => {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Header />
      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0 h-100">
          <Col xs="auto" className="sidebar-col">
            <Sidebar />
          </Col>
          <Col className="d-flex flex-column main-content">
            <main className="flex-grow-1 p-4">
              <Outlet />
            </main>
            <Footer />
          </Col>
        </Row>
      </Container>
      <style jsx>{`
        .sidebar-col {
          position: sticky;
          top: 0;
          height: calc(100vh - 56px);
          overflow-y: auto;
        }
        .main-content {
          min-height: calc(100vh - 56px);
        }
      `}</style>
    </div>
  )
}

export default Layout
