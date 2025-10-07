import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0">
          <Col xs="auto">
            <Sidebar />
          </Col>
          <Col className="d-flex flex-column">
            <main className="flex-grow-1 p-4">
              <Outlet />
            </main>
            <Footer />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
