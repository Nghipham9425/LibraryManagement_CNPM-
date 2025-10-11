import { useState, useEffect } from "react"
import { Card, Button, Container, Spinner } from "react-bootstrap"
import { FaPlus, FaBook } from "react-icons/fa"
import { toast } from "react-toastify"
import { bookAPI } from "../apis"
import BookTable from "../components/Books/BookTable"
import BookFormModal from "../components/Books/BookFormModal"
import BookSearch from "../components/Books/BookSearch"

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationYear: "",
    publisher: "",
    imageUrl: "",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchBooks()
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

  const handleSubmit = async (formData) => {
    try {
      if (editingBook) {
        await bookAPI.update(editingBook.id, formData)
        toast.success("Cập nhật sách thành công")
      } else {
        await bookAPI.create(formData)
        toast.success("Thêm sách thành công")
      }
      setShowModal(false)
      setEditingBook(null)
      resetForm()
      fetchBooks()
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.errors
        Object.values(validationErrors).forEach((messages) => {
          messages.forEach((message) => toast.error(message))
        })
      } else {
        toast.error(error.response?.data?.message || "Lỗi khi lưu sách")
      }
    }
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || "",
      genre: book.genre || "",
      publicationYear: book.publicationYear || "",
      publisher: book.publisher || "",
      imageUrl: book.imageUrl || "",
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

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      genre: "",
      publicationYear: "",
      publisher: "",
      imageUrl: "",
    })
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container fluid>
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

      <Card className="border-0 shadow-sm">
        <Card.Body>
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
            <BookTable
              books={filteredBooks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Card.Body>
      </Card>

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
      />
    </Container>
  )
}

export default Books
