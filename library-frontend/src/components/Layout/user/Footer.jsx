import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaBook,
  FaFacebookSquare,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => (
  <footer className="bg-primary text-white text-center text-lg-start mt-5">
    <Container className="py-4">
      <Row className="my-4">
        <Col
          lg={3}
          md={6}
          className="mb-4 mb-md-0 d-flex flex-column align-items-center"
        >
          <div
            className="rounded-circle bg-white shadow d-flex align-items-center justify-content-center mb-4 mx-auto"
            style={{ width: 100, height: 100 }}
          >
            <FaBook size={48} color="#0d6efd" />
          </div>
          <p className="text-center mb-2">
            Huflit Library - Thư viện điện tử
          </p>
          <div className="d-flex flex-row justify-content-center gap-3">
            <a className="text-white" href="#">
              <FaFacebookSquare size={24} />
            </a>
            <a className="text-white" href="#">
              <FaInstagram size={24} />
            </a>
            <a className="text-white" href="#">
              <FaYoutube size={24} />
            </a>
          </div>
        </Col>
        <Col lg={3} md={6} className="mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4">Danh mục</h5>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Trang chủ
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Thể loại sách
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Tác giả nổi bật
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Giới thiệu thư viện
              </a>
            </li>
          </ul>
        </Col>
        <Col lg={3} md={6} className="mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4">Thông tin</h5>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Hướng dẫn sử dụng
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Quy định mượn trả
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Câu hỏi thường gặp
              </a>
            </li>
            <li className="mb-2">
              <a
                href="#"
                className="text-white text-decoration-none"
              >
                Liên hệ hỗ trợ
              </a>
            </li>
          </ul>
        </Col>
        <Col lg={3} md={6} className="mb-4 mb-md-0">
          <h5 className="text-uppercase mb-4">Liên hệ</h5>
          <ul className="list-unstyled">
            <li>
              <FaMapMarkerAlt className="me-2" /> Huflit HM
            </li>
            <li>
              <FaPhone className="me-2" /> 0123 456 789
            </li>
            <li>
              <FaEnvelope className="me-2" /> info@HF.com
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
    <div
      className="text-center p-3"
      style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
    >
      © {new Date().getFullYear()} Huflit Library
    </div>
  </footer>
);

export default Footer;
