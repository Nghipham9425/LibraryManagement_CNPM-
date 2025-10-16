import React from "react"
import { Container, Row, Col, Card } from "react-bootstrap"

const authors = [
  { name: "James Clear", books: "600+ Books" },
  { name: "Lucy Caldwell", books: "100+ Books" },
  { name: "Alan Trotter", books: "150+ Novels" },
  { name: "Sarah Vaughan", books: "200+ Books" },
]

const Authors = () => (
  <Container className="py-5">
    <h3 className="fw-bold mb-4">Popular Authors</h3>
    <Row>
      {authors.map((author, idx) => (
        <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
          <Card className="shadow-sm text-center">
            <Card.Body>
              <div className="rounded-circle bg-secondary mx-auto mb-2" style={{ width: 64, height: 64 }}></div>
              <div className="fw-bold">{author.name}</div>
              <div className="text-secondary">{author.books}</div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
)

export default Authors
