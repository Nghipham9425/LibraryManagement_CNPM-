import { useState, useEffect } from "react"
import { Card, Button, Container, Spinner } from "react-bootstrap"
import { FaPlus, FaBook } from "react-icons/fa"
import { toast } from "react-toastify"
import { bookAPI, authorAPI, genreAPI } from "../../../apis"
import BookGrid from "../../../components/Books/BookGrid"
import BookFormModal from "../../../components/Books/BookFormModal"
import BookDetailsModal from "../../../components/Books/BookDetailsModal"
import BookSearch from "../../../components/Books/BookSearch"

const Books = () => {
  const bookErrorMessages = (error) => {
    const validationErrors = error.response?.data?.errors
    if (error.response?.status === 400 && validationErrors) {
      return Object.values(validationErrors).flat()
    }
    return [error.response?.data?.message || "Lỗi khi lưu sách"]
  }
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    authorIds: [],
    isbn: "",
    genreId: "",
    publicationYear: "",
    publisher: "",
    imageUrl: "",
    description: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    fetchBooks()
    fetchAuthors()
    fetchGenres()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await bookAPI.getAll()
      setBooks(data)
    } catch {
      toast.error("Lỗi khi tải danh sách sách")
    } finally {
      setLoading(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      const data = await authorAPI.getAll()
      setAuthors(data)
    } catch {
      toast.error("Lỗi khi tải danh sách tác giả")
    }
  }

  const fetchGenres = async () => {
    try {
      const data = await genreAPI.getAll()
      setGenres(data)
    } catch {
      toast.error("Lỗi khi tải danh sách thể loại")
    }
  }

  const handleSubmit = async (formData) => {
    const cleanData = {
      ...formData,
      publicationYear:
        formData.publicationYear === "" || formData.publicationYear === null
          ? null
          : Number(formData.publicationYear),
    }
    try {
      if (editingBook) {
        await bookAPI.update(editingBook.id, cleanData)
        toast.success("Cập nhật sách thành công")
      } else {
        await bookAPI.create(cleanData)
        toast.success("Thêm sách thành công")
      }
      setShowModal(false)
      setEditingBook(null)
      resetForm()
      fetchBooks()
    } catch (error) {
      bookErrorMessages(error).forEach((msg) => toast.error(msg))
    }
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      authorIds: book.bookAuthors ? book.bookAuthors.map(ba => ba.authorId) : [],
      isbn: book.isbn || "",
      genreIds: book.genres ? genres.filter(g => book.genres.includes(g.name)).map(g => g.id) : [],
      publicationYear: book.publicationYear || "",
      publisher: book.publisher || "",
      imageUrl: book.imageUrl || "",
      description: book.description || "",
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      try {
        await bookAPI.delete(id)
        toast.success("Xóa sách thành công")
        fetchBooks()
      } catch {
        toast.error("Lỗi khi xóa sách")
      }
    }
  }

  const handleViewDetails = (book) => {
    setSelectedBook(book)
    setShowDetailsModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      authorIds: [],
      isbn: "",
      genreIds: [],
      publicationYear: "",
      publisher: "",
      imageUrl: "",
      description: "",
    })
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.bookAuthors && book.bookAuthors.some(ba => ba.authorName?.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Sách</h2>
          <p className="text-muted mb-0">
            Quản lý bộ sưu tập sách trong thư viện
          </p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center text-white"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="me-2" />
          Thêm Sách Mới
        </Button>
      </div>

      <BookSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Đang tải...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-5">
              <FaBook size={64} className="text-muted mb-3" />
              <h5 className="fw-bold">Chưa Có Sách</h5>
              <p className="text-muted">
                Bắt đầu bằng cách thêm cuốn sách đầu tiên vào thư viện.
              </p>
              <Button
                variant="outline-primary"
                className="mt-2 text-primary"
                onClick={() => setShowModal(true)}
              >
                <FaPlus className="me-2" />
                Thêm Sách Đầu Tiên
              </Button>
            </div>
          ) : (
            <BookGrid
              books={filteredBooks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </div>

      <BookFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false)
          setEditingBook(null)
          resetForm()
        }}
        editingBook={editingBook}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        authors={authors}
        genres={genres}
      />

      <BookDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        book={selectedBook}
      />
    </div>
  )
}

export default Books
