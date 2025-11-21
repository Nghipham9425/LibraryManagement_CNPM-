import React, { useState, useEffect } from "react"
import { Container, Row, Col, Card, Spinner } from "react-bootstrap"
import { Link } from "react-router-dom"
import {
  FaBook,
  FaLaptopCode,
  FaHeart,
  FaFlask,
  FaTheaterMasks,
  FaHistory,
  FaPalette,
  FaGlobeAsia,
  FaRocket,
  FaFootballBall,
  FaBriefcase,
  FaLandmark,
  FaBrain,
  FaLightbulb,
  FaCode
} from "react-icons/fa"
import { genreAPI } from "../../apis"

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Icon mapping dựa trên tên thể loại
  const getIconAndColor = (name) => {
    const lowerName = name.toLowerCase()
    
    if (lowerName.includes('programming') || lowerName.includes('code')) {
      return { icon: <FaCode />, color: "#9b59b6", bgColor: "rgba(155, 89, 182, 0.1)" }
    }
    if (lowerName.includes('psychology') || lowerName.includes('tâm lý')) {
      return { icon: <FaHeart />, color: "#e74c3c", bgColor: "rgba(231, 76, 60, 0.1)" }
    }
    if (lowerName.includes('fiction') || lowerName.includes('phiêu lưu')) {
      return { icon: <FaBook />, color: "#3498db", bgColor: "rgba(52, 152, 219, 0.1)" }
    }
    if (lowerName.includes('science') || lowerName.includes('khoa học')) {
      return { icon: <FaFlask />, color: "#2ecc71", bgColor: "rgba(46, 204, 113, 0.1)" }
    }
    if (lowerName.includes('history') || lowerName.includes('lịch sử') || lowerName.includes('cổ đại')) {
      return { icon: <FaHistory />, color: "#e67e22", bgColor: "rgba(230, 126, 34, 0.1)" }
    }
    if (lowerName.includes('business') || lowerName.includes('finance')) {
      return { icon: <FaBriefcase />, color: "#f39c12", bgColor: "rgba(243, 156, 18, 0.1)" }
    }
    if (lowerName.includes('art') || lowerName.includes('nghệ thuật')) {
      return { icon: <FaPalette />, color: "#f39c12", bgColor: "rgba(243, 156, 18, 0.1)" }
    }
    if (lowerName.includes('vũ trụ') || lowerName.includes('space')) {
      return { icon: <FaRocket />, color: "#8e44ad", bgColor: "rgba(142, 68, 173, 0.1)" }
    }
    if (lowerName.includes('thể thao') || lowerName.includes('sport')) {
      return { icon: <FaFootballBall />, color: "#27ae60", bgColor: "rgba(39, 174, 96, 0.1)" }
    }
    if (lowerName.includes('tình cảm') || lowerName.includes('romance')) {
      return { icon: <FaHeart />, color: "#e91e63", bgColor: "rgba(233, 30, 99, 0.1)" }
    }
    if (lowerName.includes('classic')) {
      return { icon: <FaLandmark />, color: "#795548", bgColor: "rgba(121, 85, 72, 0.1)" }
    }
    if (lowerName.includes('self-help') || lowerName.includes('leadership')) {
      return { icon: <FaLightbulb />, color: "#ff9800", bgColor: "rgba(255, 152, 0, 0.1)" }
    }
    if (lowerName.includes('software') || lowerName.includes('engineering')) {
      return { icon: <FaLaptopCode />, color: "#607d8b", bgColor: "rgba(96, 125, 139, 0.1)" }
    }
    if (lowerName.includes('dystopian')) {
      return { icon: <FaTheaterMasks />, color: "#455a64", bgColor: "rgba(69, 90, 100, 0.1)" }
    }
    
    // Default
    return { icon: <FaBook />, color: "#1abc9c", bgColor: "rgba(26, 188, 156, 0.1)" }
  }

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true)
        const data = await genreAPI.getAll()
        // Chỉ lấy các thể loại có sách (bookCount > 0) và sort theo bookCount
        const filteredGenres = data
          .filter(genre => genre.bookCount > 0)
          .sort((a, b) => b.bookCount - a.bookCount)
          .slice(0, 8) // Chỉ lấy 8 thể loại phổ biến nhất
          .map(genre => ({
            ...genre,
            ...getIconAndColor(genre.name)
          }))
        setCategories(filteredGenres)
      } catch (error) {
        console.error('Lỗi khi tải thể loại:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (loading) {
    return (
      <section className="py-5" style={{ background: "#fafbfc" }}>
        <Container>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Đang tải thể loại...</p>
          </div>
        </Container>
      </section>
    )
  }

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
                to={`/books?genre=${encodeURIComponent(category.name)}`}
                className="text-decoration-none w-100"
              >
                <Card
                  className="h-100 border-0 shadow-sm text-center category-card"
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
                      {category.bookCount.toLocaleString()} cuốn sách
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
            to="/books"
            className="btn btn-outline-primary rounded-pill px-4"
            style={{ fontWeight: 500 }}
          >
            Xem tất cả sách{" "}
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
