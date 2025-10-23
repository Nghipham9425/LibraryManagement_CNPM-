import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, Row, Col, Form, Button, InputGroup, Badge, Spinner } from 'react-bootstrap'
import { FaSearch, FaRedo } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { bookAPI, genreAPI } from '../../../apis'
import BookGrid from '../../../components/Books/BookGrid'
import BookDetailsModal from '../../../components/Books/BookDetailsModal'

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [genres, setGenres] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchBooks()
    fetchGenres()
  }, [])

  useEffect(() => {
    const genreParam = searchParams.get('genre')
    if (genreParam && genres.some(g => g.name === genreParam)) {
      setSelectedGenre(genreParam)
    }
  }, [searchParams, genres])

  useEffect(() => {
    let filtered = books

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.bookAuthors &&
            book.bookAuthors.some((ba) =>
              ba.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      )
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter((book) => {
        if (!book.genres) return false
        return book.genres.some((genre) => genre.name === selectedGenre)
      })
    }

    setFilteredBooks(filtered)
  }, [books, searchTerm, selectedGenre])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await bookAPI.getAll()
      setBooks(data)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sách')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const data = await genreAPI.getAll()
      setGenres(data)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thể loại')
      console.error(error)
    }
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedGenre('all')
  }

  const handleViewDetails = (book) => {
    setSelectedBook(book)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedBook(null)
  }

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Đang tải danh sách sách...</p>
        </div>
      </Container>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5ebe0, #f0e6d2)',
        backdropFilter: 'blur(10px)',
        padding: '20px 0',
        animation: 'fadeIn 0.5s ease-in-out'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <Container>
        <Row className="mb-4">
          <Col>
            <h1 className="text-center mb-4" style={{ color: '#333' }}>Tất Cả Sách</h1>

            {/* Controls */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
              }}
            >
              <Row className="g-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Tìm sách hoặc tác giả..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    <option value="all">Tất Cả Thể Loại</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.name}>
                        {genre.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button variant="outline-secondary" onClick={handleReset} className="w-100">
                    <FaRedo className="me-1" />
                    Reset
                  </Button>
                </Col>
              </Row>

              {/* Stats */}
              <div className="text-center mt-3">
                <Badge bg="primary" className="px-3 py-2">
                  {filteredBooks.length} / {books.length} sách
                </Badge>
              </div>
            </div>

            {/* Books Grid */}
            <BookGrid
              books={filteredBooks}
              onViewDetails={handleViewDetails}
              onEdit={() => {}} // Not implemented for user view
              onDelete={() => {}} // Not implemented for user view
            />

            {/* No books message */}
            {filteredBooks.length === 0 && (
              <div className="text-center mt-5">
                <h4 className="text-muted">Không tìm thấy sách nào</h4>
                <p className="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal
          show={showDetailsModal}
          onHide={handleCloseDetailsModal}
          book={selectedBook}
        />
      )}
    </div>
  )
}

export default Books