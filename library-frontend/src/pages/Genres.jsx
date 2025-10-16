// src/pages/Genres.jsx
import { useState, useEffect } from "react";
import { Card, Button, Container, Table, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { FaTags, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { genreAPI } from "../apis"; // <-- THAY ĐỔI 1: Import genreAPI

const Genres = () => {
  const [genres, setGenres] = useState([]); // <-- THAY ĐỔI 2: Đổi tên state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null); // <-- Đổi tên state
  const [formData, setFormData] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await genreAPI.getAll(); // <-- THAY ĐỔI 3: Gọi API tương ứng
      setGenres(data);
    } catch (err) {
      setError("Không thể tải danh sách thể loại");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (genre = null) => {
    if (genre) {
      setEditingGenre(genre);
      setFormData({ name: genre.name });
    } else {
      setEditingGenre(null);
      setFormData({ name: "" });
    }
    setFormErrors([]);
    setShowModal(true);
  };

  const handleCloseModal = () => { /* Giữ nguyên */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormErrors([]);
    try {
      if (editingGenre) {
        await genreAPI.update(editingGenre.id, formData);
      } else {
        await genreAPI.create(formData);
      }
      await loadGenres();
      handleCloseModal();
    } catch (err) {
      // ... (giữ nguyên logic xử lý lỗi)
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) return;
    try {
      await genreAPI.delete(id);
      await loadGenres();
    } catch (err) {
      setError("Không thể xóa thể loại");
    }
  };

  if (loading) { /* Giữ nguyên */ }

  return (
    <Container fluid>
      {/* THAY ĐỔI 4: Cập nhật các tiêu đề và văn bản */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Quản Lý Thể Loại</h2>
          <p className="text-muted mb-0">Quản lý danh sách thể loại trong thư viện</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" /> Thêm Thể Loại
        </Button>
      </div>
      
      {error && <Alert /* Giữ nguyên */ />}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {genres.length === 0 ? (
            <div className="text-center py-5">
              <FaTags size={64} className="text-muted mb-3" />
              <h5 className="fw-bold">Chưa Có Thể Loại</h5>
              {/* ... */}
            </div>
          ) : (
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Tên Thể Loại</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr key={genre.id}>
                    <td>{genre.id}</td>
                    <td className="fw-semibold">{genre.name}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(genre)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(genre.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        {/* ... (Cập nhật tiêu đề trong Modal) ... */}
      </Modal>
    </Container>
  );
};

export default Genres;