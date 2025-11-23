import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center text-primary mb-4">Liên Hệ</h2>
      
      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <div className="mb-3">
                <FaMapMarkerAlt className="text-primary me-2" />
                <strong>Địa chỉ:</strong>
                <p className="ms-4 mb-0">Trường ĐH Ngoại ngữ - Tin học, Hóc Môn, TP.HCM</p>
              </div>
              <div className="mb-3">
                <FaPhone className="text-success me-2" />
                <strong>Điện thoại:</strong>
                <p className="ms-4 mb-0">(028) 3962 426</p>
              </div>
              <div className="mb-3">
                <FaEnvelope className="text-info me-2" />
                <strong>Email:</strong>
                <p className="ms-4 mb-0">library@huflit.edu.vn</p>
              </div>
              <div>
                <FaClock className="text-warning me-2" />
                <strong>Giờ làm việc:</strong>
                <p className="ms-4 mb-0">Thứ 2 - 6: 8:00 - 17:00 | Thứ 7: 8:00 - 12:00</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5556.287560413584!2d106.59605134572773!3d10.86449998611392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b088de30f3b%3A0xd2140740d360f705!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBOZ2_huqFpIG5n4buvIC0gVGluIGjhu41jIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCAoSFVGTElUKSBDxqEgc-G7nyBIw7NjIE3DtG4!5e0!3m2!1svi!2s!4v1763900133808!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen=""
                loading="lazy"
                title="Bản đồ"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;