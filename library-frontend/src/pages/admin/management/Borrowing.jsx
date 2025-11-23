import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Tabs, Tab, Form, InputGroup, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaCalendarAlt, FaUndo, FaEye } from 'react-icons/fa';
import axios from 'axios';
import BorrowingDetailModal from '../../../components/admin/BorrowingDetailModal';
import "../../../styles/BorrowingManagement.css"

const BorrowingManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [borrowings, setBorrowings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/borrowings/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch stats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchBorrowings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const statusParam = activeTab === 'active' ? 'active' : activeTab === 'overdue' ? 'overdue' : 'returned';
      const response = await axios.get('http://localhost:5000/api/borrowings/all', {
        params: { status: statusParam, search: searchTerm }
      });
      setBorrowings(response.data);
    } catch (err) {
      setError('Không thể tải dữ liệu mượn trả');
      console.error('Error fetching borrowings:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm]);

  // Fetch borrowings when tab changes
  useEffect(() => {
    fetchBorrowings();
  }, [fetchBorrowings]);

  const handleReturn = async (id) => {
    if (!confirm('Xác nhận trả sách cho phiếu mượn này?')) return;
    try {
      await axios.post(`http://localhost:5000/api/borrowings/${id}/return-admin`);
      fetchBorrowings();
      fetchStats();
      alert('Trả sách thành công!');
    } catch (err) {
      alert('Lỗi khi trả sách: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewDetail = async (borrowingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/borrowings/${borrowingId}`);
      setSelectedBorrowing(response.data);
      setShowDetailModal(true);
    } catch (err) {
      alert('Không thể tải chi tiết: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <Badge bg="warning">Đang mượn</Badge>;
      case 1: return <Badge bg="success">Đã trả</Badge>;
      case 2: return <Badge bg="danger">Mất sách</Badge>;
      case 3: return <Badge bg="warning">Hỏng</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const isOverdue = (dueDate, status) => {
    return status === 0 && new Date(dueDate) < new Date();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <Container fluid className="borrowing-management py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">Quản lý mượn trả sách</h2>
          
          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3}>
              <div className="stat-card bg-warning text-white p-3 rounded">
                <h5>Đang mượn</h5>
                <h3>{stats.totalActive || 0}</h3>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-card bg-danger text-white p-3 rounded">
                <h5>Quá hạn</h5>
                <h3>{stats.totalOverdue || 0}</h3>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-card bg-success text-white p-3 rounded">
                <h5>Đã trả</h5>
                <h3>{stats.totalReturned || 0}</h3>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-card bg-primary text-white p-3 rounded">
                <h5>Tổng số</h5>
                <h3>{stats.totalBorrowings || 0}</h3>
              </div>
            </Col>
          </Row>

          {/* Search Bar */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm theo tên người mượn, tên sách, mã kiểm soát..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Tabs */}
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="active" title={`Đang mượn (${stats.totalActive || 0})`}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người mượn</th>
                      <th>Thẻ thư viện</th>
                      <th>Sách</th>
                      <th>Mã kiểm soát</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowings.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">Không có dữ liệu</td>
                      </tr>
                    ) : (
                      borrowings.map((b) => (
                        <tr key={b.id} className={isOverdue(b.dueDate, b.status) ? 'table-danger' : ''}>
                          <td>{b.id}</td>
                          <td>{b.userName || 'N/A'}</td>
                          <td>
                            <strong>{b.cardNumber || 'N/A'}</strong>
                          </td>
                          <td>{b.bookItem?.book?.title || 'N/A'}</td>
                          <td>{b.bookItem?.controlNumber || 'N/A'}</td>
                          <td>{formatDate(b.borrowDate)}</td>
                          <td>
                            {formatDate(b.dueDate)}
                            {isOverdue(b.dueDate, b.status) && (
                              <Badge bg="danger" className="ms-2">Quá hạn</Badge>
                            )}
                          </td>
                          <td>{getStatusBadge(b.status)}</td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <Button
                                size="sm"
                                variant="info"
                                onClick={() => handleViewDetail(b.id)}
                              >
                                <FaEye /> Chi tiết
                              </Button>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleReturn(b.id)}
                              >
                                <FaUndo /> Trả sách
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Tab>

            <Tab eventKey="overdue" title={`Quá hạn (${stats.totalOverdue || 0})`}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người mượn</th>
                      <th>Thẻ thư viện</th>
                      <th>Sách</th>
                      <th>Mã kiểm soát</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                      <th>Số ngày quá hạn</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowings.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">Không có dữ liệu</td>
                      </tr>
                    ) : (
                      borrowings.map((b) => {
                        const overdueDays = Math.floor((new Date() - new Date(b.dueDate)) / (1000 * 60 * 60 * 24));
                        return (
                          <tr key={b.id} className="table-danger">
                            <td>{b.id}</td>
                            <td>{b.userName || 'N/A'}</td>
                            <td>
                              <strong>{b.cardNumber || 'N/A'}</strong>
                            </td>
                            <td>{b.bookItem?.book?.title || 'N/A'}</td>
                            <td>{b.bookItem?.controlNumber || 'N/A'}</td>
                            <td>{formatDate(b.borrowDate)}</td>
                            <td>{formatDate(b.dueDate)}</td>
                            <td>
                              <Badge bg="danger">{overdueDays} ngày</Badge>
                            </td>
                            <td>
                              <div className="d-flex flex-column gap-1">
                                <Button
                                  size="sm"
                                  variant="info"
                                  onClick={() => handleViewDetail(b.id)}
                                >
                                  <FaEye /> Chi tiết
                                </Button>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleReturn(b.id)}
                                >
                                  <FaUndo /> Trả sách
                                </Button>
                                <small className="text-danger">⚠️ Không thể gia hạn khi quá hạn</small>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              )}
            </Tab>

            <Tab eventKey="returned" title={`Lịch sử (${stats.totalReturned || 0})`}>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người mượn</th>
                      <th>Thẻ thư viện</th>
                      <th>Sách</th>
                      <th>Mã kiểm soát</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                      <th>Ngày trả</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowings.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">Không có dữ liệu</td>
                      </tr>
                    ) : (
                      borrowings.map((b) => (
                        <tr key={b.id}>
                          <td>{b.id}</td>
                          <td>{b.userName || 'N/A'}</td>
                          <td>
                            <strong>{b.cardNumber || 'N/A'}</strong>
                          </td>
                          <td>{b.bookItem?.book?.title || 'N/A'}</td>
                          <td>{b.bookItem?.controlNumber || 'N/A'}</td>
                          <td>{formatDate(b.borrowDate)}</td>
                          <td>{formatDate(b.dueDate)}</td>
                          <td>{b.returnDate ? formatDate(b.returnDate) : 'N/A'}</td>
                          <td>{getStatusBadge(b.status)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleViewDetail(b.id)}
                            >
                              <FaEye /> Chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Detail Modal */}
      {selectedBorrowing && (
        <BorrowingDetailModal
          show={showDetailModal}
          onHide={() => {
            setShowDetailModal(false);
            setSelectedBorrowing(null);
          }}
          borrowing={selectedBorrowing}
          onReturn={handleReturn}
          onRefresh={() => {
            fetchBorrowings();
            fetchStats();
          }}
        />
      )}
    </Container>
  );
};

export default BorrowingManagement;
