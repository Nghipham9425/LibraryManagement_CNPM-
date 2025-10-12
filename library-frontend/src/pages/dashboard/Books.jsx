import { useState, useEffect } from "react"
import { Card, Button, Container, Spinner } from "react-bootstrap"
import { FaPlus, FaBook } from "react-icons/fa"
import { toast } from "react-toastify"
import { bookAPI } from "../apis"
import BookGrid from "../components/Books/BookGrid"
import BookFormModal from "../components/Books/BookFormModal"
import BookDetailsModal from "../components/Books/BookDetailsModal"
import BookSearch from "../components/Books/BookSearch"

const Books = () => {
  const bookErrorMessages = (error) => {
    const validationErrors = error.response?.data?.errors
    if (error.response?.status === 400 && validationErrors) {
      return Object.values(validationErrors).flat()
    }
    return [error.response?.data?.message || "Error saving book"]
  }

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
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await bookAPI.getAll()
      setBooks(data)
    } catch {
      toast.error("Error loading books")
    } finally {
      setLoading(false)
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
        toast.success("Book updated successfully")
      } else {
        await bookAPI.create(cleanData)
        toast.success("Book added successfully")
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
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookAPI.delete(id)
        toast.success("Book deleted successfully")
        fetchBooks()
      } catch {
        toast.error("Error deleting book")
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
    <Container fluid style={{ padding: "2rem" }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Books
          </h2>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "10px",
            padding: "0.75rem 1.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)"
            e.target.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)"
            e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)"
          }}
        >
          <FaPlus style={{ fontSize: "14px" }} />
          New Book
        </Button>
      </div>

      {/* Search */}
      <BookSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Content */}
      <Card
        style={{
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          backgroundColor: "#fff",
        }}
      >
        <Card.Body style={{ padding: "2rem" }}>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#667eea" }} />
              <p className="mt-3" style={{ color: "#6b7280" }}>
                Loading...
              </p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-5">
              <FaBook
                size={64}
                style={{ color: "#d1d5db", marginBottom: "1.5rem" }}
              />
              <h5
                style={{
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                No Books Yet
              </h5>
              <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                Start by adding your first book to the library.
              </p>
              <Button
                onClick={() => setShowModal(true)}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                }}
              >
                <FaPlus className="me-2" />
                Add First Book
              </Button>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-5">
              <FaBook
                size={64}
                style={{ color: "#d1d5db", marginBottom: "1.5rem" }}
              />
              <h5
                style={{
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                No Results Found
              </h5>
              <p style={{ color: "#6b7280" }}>
                Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <BookGrid
              books={filteredBooks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
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

      <BookDetailsModal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        book={selectedBook}
      />
    </Container>
  )
}

export default Books
