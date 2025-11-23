import { useState, useEffect } from 'react';
import { Container, Table, Card, Form, Button, Badge, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaFileExport, FaSearch } from 'react-icons/fa';
import { reportAPI } from '@/apis';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate year options (current year and past 5 years)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 6; i++) {
    yearOptions.push(currentYear - i);
  }

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reportAPI.getDamagedBooks(selectedYear);
      setReports(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'Lost') {
      return <Badge bg="danger">Mất</Badge>;
    }
    return <Badge bg="warning" text="dark">Hỏng</Badge>;
  };

  const exportToCSV = () => {
    if (reports.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    // CSV headers
    const headers = [
      'Mã mượn',
      'Trạng thái',
      'Ngày báo cáo',
      'Tên sách',
      'ISBN',
      'Nhà xuất bản',
      'Năm xuất bản',
      'Số kiểm soát',
      'Tên sinh viên',
      'Mã thẻ',
      'Email',
      'Tiền phạt (VND)',
      'Đã thanh toán',
      'Ngày thanh toán'
    ];

    // CSV rows
    const rows = reports.map(r => [
      r.borrowingId,
      r.status === 'Lost' ? 'Mất' : 'Hỏng',
      formatDate(r.reportDate),
      r.bookTitle,
      r.isbn,
      r.publisher,
      r.publicationYear || '',
      r.controlNumber,
      r.studentName,
      r.cardNumber,
      r.email,
      r.fineAmount || '',
      r.isPaid ? 'Có' : 'Không',
      r.paidDate ? formatDate(r.paidDate) : ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bao-cao-sach-hu-hong-${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total: reports.length,
    lost: reports.filter(r => r.status === 'Lost').length,
    damaged: reports.filter(r => r.status === 'Damaged').length,
    totalFine: reports.reduce((sum, r) => sum + (r.fineAmount || 0), 0),
    unpaidFine: reports.filter(r => !r.isPaid).reduce((sum, r) => sum + (r.fineAmount || 0), 0)
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📊 Báo cáo sách mất/hỏng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="text-muted">Tổng số</h5>
              <h2 className="mb-0">{stats.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-danger">
            <Card.Body>
              <h5 className="text-danger">Sách mất</h5>
              <h2 className="mb-0 text-danger">{stats.lost}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h5 className="text-warning">Sách hỏng</h5>
              <h2 className="mb-0 text-warning">{stats.damaged}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <h5 className="text-info">Chưa thanh toán</h5>
              <h2 className="mb-0 text-info">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.unpaidFine)}
              </h2>
              <small className="text-muted">
                Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalFine)}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Năm báo cáo</Form.Label>
                <Form.Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button variant="primary" onClick={fetchReports}>
                <FaSearch className="me-2" />
                Tìm kiếm
              </Button>
            </Col>
            <Col md={6} className="text-end">
              <Button
                variant="success"
                onClick={exportToCSV}
                disabled={reports.length === 0}
              >
                <FaFileExport className="me-2" />
                Xuất CSV
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Report Table */}
      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Mã mượn</th>
                <th>Trạng thái</th>
                <th>Ngày báo cáo</th>
                <th>Tên sách</th>
                <th>ISBN</th>
                <th>Số kiểm soát</th>
                <th>Sinh viên</th>
                <th>Mã thẻ</th>
                <th>Tiền phạt</th>
                <th>Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-muted">
                    Không có sách mất/hỏng trong năm {selectedYear}
                  </td>
                </tr>
              ) : (
                reports.map(report => (
                  <tr key={report.borrowingId}>
                    <td>#{report.borrowingId}</td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td>{formatDate(report.reportDate)}</td>
                    <td>
                      <strong>{report.bookTitle}</strong>
                      {report.publisher && (
                        <div className="text-muted small">
                          {report.publisher} ({report.publicationYear})
                        </div>
                      )}
                    </td>
                    <td><code>{report.isbn}</code></td>
                    <td><code>{report.controlNumber}</code></td>
                    <td>
                      {report.studentName}
                      {report.email && (
                        <div className="text-muted small">{report.email}</div>
                      )}
                    </td>
                    <td><Badge bg="secondary">{report.cardNumber}</Badge></td>
                    <td>
                      {report.fineAmount ? (
                        <strong className="text-danger">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(report.fineAmount)}
                        </strong>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td>
                      {report.isPaid ? (
                        <Badge bg="success">Đã thanh toán</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">Chưa thanh toán</Badge>
                      )}
                      {report.paidDate && (
                        <div className="text-muted small mt-1">
                          {formatDate(report.paidDate)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;
