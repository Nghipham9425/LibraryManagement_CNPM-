import React from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"

const genres = [
  "Adventure", "Biography", "Thriller", "Love", "Fiction", "Science Fiction", "History", "Adult"
]

const Genres = () => (
  <Container className="py-5">
    <h3 className="fw-bold mb-4">Browse Genres</h3>
    <Row>
      {genres.map((genre, idx) => (
        <Col key={idx} md={3} sm={4} xs={6} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="fw-bold mb-2">{genre}</div>
              <Button variant="outline-primary" size="sm">Explore</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
)

export default Genres
