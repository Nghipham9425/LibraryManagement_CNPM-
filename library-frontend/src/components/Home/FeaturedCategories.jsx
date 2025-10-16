import React from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import {
  FaBook,
  FaLaptopCode,
  FaHeart,
  FaFlask,
  FaTheaterMasks,
  FaHistory,
  FaPalette,
  FaGlobeAsia
} from "react-icons/fa"

const FeaturedCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Văn học",
      icon: <FaBook />,
      count: 1250,
      color: "#3498db",
      bgColor: "rgba(52, 152, 219, 0.1)"
    },
    {
      id: 2,
      name: "Công nghệ",
      icon: <FaLaptopCode />,
      count: 850,
      color: "#9b59b6",
      bgColor: "rgba(155, 89, 182, 0.1)"
    },
    {
      id: 3,
      name: "Tâm lý",
      icon: <FaHeart />,
      count: 620,
      color: "#e74c3c",
      bgColor: "rgba(231, 76, 60, 0.1)"
    },
    {
      id: 4,
      name: "Khoa học",
      icon: <FaFlask />,
      count: 920,
      color: "#2ecc71",
      bgColor: "rgba(46, 204, 113, 0.1)"
    },
    {
      id: 5,
      name: "Nghệ thuật",
      icon: <FaPalette />,
      count: 580,
      color: "#f39c12",
      bgColor: "rgba(243, 156, 18, 0.1)"
    },
    {
      id: 6,
      name: "Lịch sử",
      icon: <FaHistory />,
      count: 720,
      color: "#e67e22",
      bgColor: "rgba(230, 126, 34, 0.1)"
    },
    {
      id: 7,
      name: "Triết học",
      icon: <FaTheaterMasks />,
      count: 450,
      color: "#1abc9c",
      bgColor: "rgba(26, 188, 156, 0.1)"
    },
    {
      id: 8,
      name: "Du lịch",
      icon: <FaGlobeAsia />,
      count: 380,
      color: "#34495e",
      bgColor: "rgba(52, 73, 94, 0.1)"
    }
  ]

  return (
    <section className="py-4" style={{ background: "#fafbfc" }}>
      <Container>
        {/* Section Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>
            Khám Phá Theo Thể Loại
          </h2>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Tìm kiếm sách yêu thích theo danh mục phù hợp với bạn
          </p>
        </div>

        {/* Categories Grid */}
        <Row className="g-3 justify-content-center">
          {categories.map((category) => (
            <Col key={category.id} lg={3} md={4} sm={6} xs={12} className="d-flex">
              <Link
                to={`/genres/${category.id}`}
                className="text-decoration-none w-100"
              >
                <Card
                  className="h-100 border-0 shadow-sm text-center"
                  style={{
                    background: "#fff",
                    transition: "all 0.3s",
                    cursor: "pointer"
                  }}
                >
                  <Card.Body className="p-4">
                    {/* Icon */}
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: "56px",
                        height: "56px",
                        backgroundColor: category.bgColor,
                        color: category.color,
                        fontSize: "1.7rem"
                      }}
                    >
                      {category.icon}
                    </div>

                    {/* Category Name */}
                    <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: "1.05rem" }}>
                      {category.name}
                    </h6>

                    {/* Book Count */}
                    <div className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                      {category.count.toLocaleString()} cuốn sách
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* View All Categories */}
        <div className="text-center mt-4">
          <Link
            to="/genres"
            className="btn btn-outline-primary rounded-pill px-4"
            style={{ fontWeight: 500 }}
          >
            Xem tất cả thể loại{" "}
            <span style={{ fontSize: "1.1em" }}>→</span>
          </Link>
        </div>
      </Container>

      <style>{`
        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </section>
  )
}

export default FeaturedCategories
