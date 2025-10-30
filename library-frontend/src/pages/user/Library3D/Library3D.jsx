
import { useState, useEffect, memo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Container, Form, Button, Spinner, InputGroup, Badge } from 'react-bootstrap'
import { FaSearch, FaRedo, FaCube } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { bookAPI, genreAPI } from '../../../apis'
import BooksScene from '../../../components/Library3D/BooksScene'
import BookInfoPanel from '../../../components/Library3D/BookInfoPanel'

const Library3D = memo(() => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedBook, setSelectedBook] = useState(null)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetchBooks()
    fetchGenres()
  }, [])

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    let filtered = books

    // Filter by search term
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (book.bookAuthors &&
            book.bookAuthors.some((ba) =>
              ba.authorName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
  }, [books, debouncedSearchTerm, selectedGenre])

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
    setSelectedBook(null)
  }

  const handleBookClick = (book) => {
    setSelectedBook(book)
  }

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Đang tải thư viện 3D...</p>
        </div>
      </Container>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Controls Panel */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
        }}
      >
        <div className="d-flex align-items-center mb-3">
          <FaCube className="me-2 text-primary" size={24} />
        </div>

        {/* Search */}
        <InputGroup className="mb-3">
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

        {/* Genre Filter */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold small text-muted">Thể Loại</Form.Label>
          <Form.Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="all">Tất Cả</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Stats */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Badge bg="primary" className="px-3 py-2">
            {filteredBooks.length} / {books.length} sách
          </Badge>
          <Button variant="outline-secondary" size="sm" onClick={handleReset}>
            <FaRedo className="me-1" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div
          style={{
            fontSize: '0.85rem',
            color: '#6c757d',
            borderTop: '1px solid #dee2e6',
            paddingTop: '12px',
          }}
        >
          <p className="mb-1">
            <strong>Chuột trái:</strong> Xoay camera
          </p>
          <p className="mb-1">
            <strong>Cuộn chuột:</strong> Zoom in/out
          </p>
          <p className="mb-0">
            <strong>Click vào sách:</strong> Xem chi tiết
          </p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #f5ebe0, #f0e6d2)' }}
      >
        <Suspense fallback={null}>
          <BooksScene
            books={filteredBooks}
            onBookClick={handleBookClick}
            selectedBook={selectedBook}
          />
        </Suspense>
      </Canvas>

      {/* Book Info Panel */}
      {selectedBook && (
        <BookInfoPanel book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {/* No books message */}
      {filteredBooks.length === 0 && !loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            zIndex: 50,
          }}
        >
          <h4>Không tìm thấy sách nào</h4>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  )
})

Library3D.displayName = 'Library3D'

export default Library3D
