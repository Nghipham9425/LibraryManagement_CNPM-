import { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { FaHistory, FaFilter, FaUser, FaBook, FaIdCard, FaExchangeAlt, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { activityLogsAPI } from '../../../apis';
import Pagination from '../../../components/Pagination';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    action: '',
    entity: '',
    fromDate: '',
    toDate: '',
    page: 1,
    pageSize: 20
  });

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchLogs();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await activityLogsAPI.getAll(filters);
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải nhật ký hoạt động');
      toast.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await activityLogsAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      entity: '',
      fromDate: '',
      toDate: '',
      page: 1,
      pageSize: 20
    });
  };

  const getActionBadge = (action) => {
    const colors = {
      'Create': 'success',
      'Update': 'info',
      'Delete': 'danger',
      'Login': 'primary',
      'Logout': 'secondary'
    };
    return <Badge bg={colors[action] || 'secondary'}>{action}</Badge>;
  };

  const getEntityIcon = (entity) => {
    const icons = {
      'Book': FaBook,
      'User': FaUser,
      'Borrowing': FaExchangeAlt,
      'LibraryCard': FaIdCard,
      'Setting': FaCog
    };
    const Icon = icons[entity] || FaHistory;
    return <Icon className="me-2" />;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  if (loading && logs.length === 0) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Đang tải nhật ký...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            <FaHistory className="me-2" />
            Nhật Ký Hoạt Động Hệ Thống
          </h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Statistics */}
          {stats && (
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center border-primary">
                  <Card.Body>
                    <h3 className="text-primary">{stats.todayCount}</h3>
                    <small className="text-muted">Hôm nay</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-info">
                  <Card.Body>
                    <h3 className="text-info">{stats.weekCount}</h3>
                    <small className="text-muted">7 ngày qua</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-success">
                  <Card.Body>
                    <h3 className="text-success">{stats.totalCount}</h3>
                    <small className="text-muted">Tổng số</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center border-warning">
                  <Card.Body>
                    <h5 className="text-warning mb-0">Top User</h5>
                    <small className="text-muted">
                      {stats.topUsers && stats.topUsers[0] ? stats.topUsers[0].userName : 'N/A'}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Filters */}
          <Card className="mb-4 bg-light">
            <Card.Body>
              <h6 className="mb-3">
                <FaFilter className="me-2" />
                Bộ lọc
              </h6>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Hành động</Form.Label>
                    <Form.Select
                      value={filters.action}
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="Create">Create</option>
                      <option value="Update">Update</option>
                      <option value="Delete">Delete</option>
                      <option value="Login">Login</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Đối tượng</Form.Label>
                    <Form.Select
                      value={filters.entity}
                      onChange={(e) => handleFilterChange('entity', e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="Book">Sách</option>
                      <option value="User">Người dùng</option>
                      <option value="Borrowing">Mượn trả</option>
                      <option value="LibraryCard">Thẻ thư viện</option>
                      <option value="Setting">Cài đặt</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Từ ngày</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.fromDate}
                      onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Đến ngày</Form.Label>
                    <Form.Control
                      type="date"
                      value={filters.toDate}
                      onChange={(e) => handleFilterChange('toDate', e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-3 text-end">
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Xóa bộ lọc
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Timeline */}
          <div className="mb-3 text-muted">
            Hiển thị {logs.length} / {totalCount} hoạt động
          </div>

          {logs.length === 0 ? (
            <Alert variant="info">Không có hoạt động nào được ghi nhận.</Alert>
          ) : (
            <div className="timeline">
              {logs.map((log) => (
                <div key={log.id} className="timeline-item mb-4">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}
                      >
                        {getEntityIcon(log.entity)}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <strong className="text-primary">{log.userName}</strong>
                              <span className="mx-2">•</span>
                              {getActionBadge(log.action)}
                              <span className="mx-2">•</span>
                              <Badge bg="light" text="dark">{log.entity}</Badge>
                            </div>
                            <small className="text-muted">{formatDate(log.createdAt)}</small>
                          </div>
                          <p className="mb-0">{log.description}</p>
                          {log.entityId && (
                            <small className="text-muted">ID: {log.entityId}</small>
                          )}
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .timeline {
          position: relative;
        }
        .timeline::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: #e9ecef;
        }
        .timeline-item {
          position: relative;
        }
      `}</style>
    </Container>
  );
};

export default ActivityLogs;
