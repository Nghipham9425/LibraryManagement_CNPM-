import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { bookAPI, genreAPI, authorAPI } from '../../../apis'
import BookGrid from '../../../components/Books/BookGrid'
import BookDetailsModal from '../../../components/Books/BookDetailsModal'
import BookSearch from '../../../components/Books/BookSearch'
import Pagination from '../../../components/Pagination'
import usePagination from '../../../hooks/usePagination'

const Books = () => {
  const [searchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [sortBy, setSortBy] = useState('title')

  // Filter logic
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.bookAuthors && book.bookAuthors.some(ba => ba.authorName?.toLowerCase().includes(searchTerm.toLowerCase())))
      
      const matchesGenre = !selectedGenre || (book.genres && book.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()))
      const matchesAuthor = !selectedAuthor || (book.bookAuthors && book.bookAuthors.some(ba => ba.authorName === selectedAuthor))
      const matchesAvailability = !availableOnly || (book.availableCopies && book.availableCopies > 0)

      return matchesSearch && matchesGenre && matchesAuthor && matchesAvailability
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'title-desc':
          return b.title.localeCompare(a.title)
        case 'year-desc':
          return (b.publicationYear || 0) - (a.publicationYear || 0)
        case 'year-asc':
          return (a.publicationYear || 0) - (b.publicationYear || 0)
        case 'available':
          return (b.availableCopies || 0) - (a.availableCopies || 0)
        default:
          return 0
      }
    })

  // Pagination
  const {
    currentPage,
    totalPages,
    currentItems: paginatedBooks,
    goToPage,
    totalItems,
    startIndex,
    endIndex,
  } = usePagination(filteredBooks, 12) // 12 books per page

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Lấy filter từ URL params (từ Header search, Genres, Authors)
    const genreParam = searchParams.get('genre')
    const authorParam = searchParams.get('author')
    const searchParam = searchParams.get('q')
    
    if (genreParam) {
      setSelectedGenre(decodeURIComponent(genreParam))
    }
    if (authorParam) {
      setSelectedAuthor(decodeURIComponent(authorParam))
    }
    if (searchParam) {
      setSearchTerm(decodeURIComponent(searchParam))
    }
  }, [searchParams])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [booksData, genresData, authorsData] = await Promise.all([
        bookAPI.getAll(),
        genreAPI.getAll(),
        authorAPI.getAll()
      ])
      setBooks(booksData)
      setGenres(genresData)
      setAuthors(authorsData)
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (book) => {
    setSelectedBook(book)
    setShowDetailsModal(true)
  }

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold mb-2">Tất Cả Sách</h1>
        <p className="text-muted">
          Khám phá bộ sưu tập sách phong phú của thư viện
        </p>
      </div>

      <BookSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedAuthor={selectedAuthor}
        setSelectedAuthor={setSelectedAuthor}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        genres={genres}
        authors={authors}
      />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Đang tải sách...</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-muted">
              Hiển thị {startIndex} - {endIndex} của {totalItems} cuốn sách
              {filteredBooks.length < books.length && (
                <span> (đã lọc từ {books.length} cuốn)</span>
              )}
            </p>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">Không tìm thấy sách nào phù hợp</p>
            </div>
          ) : (
            <>
              <BookGrid
                books={paginatedBooks}
                onViewDetails={handleViewDetails}
                showAdminActions={false}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          )}
        </>
      )}

      <BookDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        book={selectedBook}
      />
    </Container>
  )
}

export default Books
