import React from "react"
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaStar, FaHeart, FaEye, FaFire } from "react-icons/fa"

const TrendingBooks = ({ books = [] }) => {
  const trendingBooks = books.length > 0
    ? books.slice(0, 6).map(book => ({
        id: book.id,
        title: book.title,
        author: book.bookAuthors && book.bookAuthors.length > 0
          ? book.bookAuthors.map(a => a.authorName).join(', ')
          : 'Unknown',
        cover: book.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
        category: book.genre || 'Chưa phân loại',
      }))
    : [];

  return (
    <section className="py-5 bg-light">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill mb-3">
            <FaFire className="me-2" />
            <span className="fw-semibold">Trending Now</span>
          </div>
          <h2 className="display-5 fw-bold mb-3">Sách Đang Hot</h2>
          <p className="text-muted">
            Những cuốn sách được độc giả yêu thích nhất hiện nay
          </p>
        </div>

        {/* Books Grid */}
        <Row className="g-4">
          {trendingBooks.length === 0 ? (
            <div className="text-center text-muted py-5">Không có sách trending để hiển thị.</div>
          ) : (
            trendingBooks.map((book, index) => (
              <Col key={book.id} lg={4} md={6}>
                <Card className="h-100 border-0 shadow-sm book-card overflow-hidden">
                  {/* Badge */}
                  {index < 3 && (
                    <Badge
                      bg={index === 0 ? "danger" : index === 1 ? "warning" : "info"}
                      className="position-absolute top-0 start-0 m-3"
                      style={{ zIndex: 1 }}
                    >
                      <FaFire className="me-1" />
                      Top {index + 1}
                    </Badge>
                  )}

                  {/* Book Cover */}
                  <div className="position-relative overflow-hidden book-image-wrapper">
                    <Card.Img
                      variant="top"
                      src={book.cover}
                      alt={book.title}
                      className="book-image"
                      style={{
                        height: "320px",
                        objectFit: "cover",
                        borderRadius: "18px",
                        boxShadow: "0 4px 24px rgba(33,150,243,0.10)",
                        border: "1px solid #e3e3e3",
                        background: "#f8f9fa"
                      }}
                    />
                    <div className="book-overlay position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center">
                      <Button
                        as={Link}
                        to={`/books/${book.id}`}
                        variant="light"
                        className="rounded-pill px-4 fw-semibold"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>

                  <Card.Body>
                    {/* Category */}
                    <Badge bg="primary" className="mb-2">
                      {book.category}
                    </Badge>

                    {/* Title */}
                    <Card.Title className="fw-bold mb-2" style={{ minHeight: "48px" }}>
                      {book.title}
                    </Card.Title>

                    {/* Author */}
                    <Card.Text className="text-muted small mb-3">
                      <i className="fas fa-user-edit me-1"></i>
                      {book.author}
                    </Card.Text>
                  </Card.Body>

                  <Card.Footer className="bg-transparent border-0 pt-0 pb-3">
                    <div className="d-flex gap-2">
                      <Button
                        as={Link}
                        to={`/books/${book.id}`}
                        variant="primary"
                        size="sm"
                        className="flex-grow-1"
                      >
                        Mượn sách
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="px-3"
                        title="Yêu thích"
                      >
                        <FaHeart />
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* View All Button */}
        <div className="text-center mt-5">
          <Button
            as={Link}
            to="/books"
            variant="primary"
            size="lg"
            className="rounded-pill px-5"
          >
            Xem tất cả sách
            <i className="fas fa-arrow-right ms-2"></i>
          </Button>
        </div>
      </Container>

      <style>{`
        .book-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .book-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
        .book-image-wrapper {
          position: relative;
        }
        .book-overlay {
          background: rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .book-card:hover .book-overlay {
          opacity: 1;
        }
        .book-image {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(33,150,243,0.10);
          border: 1px solid #e3e3e3;
          background: #f8f9fa;
        }
        .book-card:hover .book-image {
          transform: scale(1.06);
          box-shadow: 0 8px 32px rgba(33,150,243,0.18);
        }
      `}</style>
    </section>
  )
}

export default TrendingBooks
