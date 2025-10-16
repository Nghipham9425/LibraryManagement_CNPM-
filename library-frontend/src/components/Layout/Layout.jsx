// src/components/Layout/Layout.jsx

import { Container, Row, Col } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import Header from "./Header" // Giả sử đây là Header của admin
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import styles from './Layout.module.css'; // Import file CSS module

const AdminLayout = () => { // Đổi tên thành AdminLayout cho nhất quán
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Header />
      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0 h-100">
          <Col xs="auto" className={styles.sidebarCol}>
            <Sidebar />
          </Col>
          
          <Col className={`d-flex flex-column ${styles.mainContent}`}>
            <main className="flex-grow-1 p-4">
              <Outlet />
            </main>
            <Footer />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminLayout;