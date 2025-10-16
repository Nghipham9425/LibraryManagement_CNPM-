import React from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaBook } from "react-icons/fa"

const HeroBanner = () => {
  return (
    <div
      className="hero-banner-bg text-white text-center d-flex align-items-center justify-content-center position-relative"
      style={{
        minHeight: "480px",
        boxShadow: "0 8px 32px rgba(33, 150, 243, 0.10)",
        borderRadius: "0 0 32px 32px",
        overflow: "hidden"
      }}
    >
      <div
        className="position-absolute w-100 h-100 top-0 start-0 hero-banner-img"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1742)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1
        }}
      ></div>

      <div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{
          background:
            "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.35))",
          zIndex: 2
        }}
      ></div>

      <Container style={{ position: "relative", zIndex: 3 }}>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="mb-3">
              <FaBook className="fs-1" style={{ color: "#FBBF24" }} />
            </div>

            <h1
              className="display-4 fw-bold mb-3"
              style={{ color: "#FFFFFF", textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
            >
              Thư Viện HF
            </h1>

            <p
              className="lead mb-4"
              style={{
                color: "#E0F2FE",
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Hệ thống quản lý thư viện trực tuyến — Khám phá hàng nghìn đầu sách,
              tác giả và thể loại yêu thích của bạn.
            </p>
            <Button
              as={Link}
              to="/books"
              size="lg"
              className="px-4 py-2 fw-semibold rounded-pill shadow-sm hero-btn"
            >
              Xem tất cả sách
            </Button>
            <div
              className="mt-4 small"
              style={{
                color: "#C7D2FE",
                fontWeight: 500
              }}
            >
              Dễ dàng tra cứu - Mượn sách nhanh chóng - Trải nghiệm tiện lợi
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default HeroBanner
