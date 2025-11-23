import { Card, Row, Col, Container } from 'react-bootstrap';
import { FaBook, FaUsers, FaExchangeAlt, FaCheckCircle, FaExclamationTriangle, FaClock, FaIdCard } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getDashboardStats, getBorrowingTrend, getTopBooks, getGenreDistribution, getOverdueStats } from '../../../apis/dashboard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalLibraryCards: 0,
    borrowingCount: 0,
    returnsToday: 0,
  });

  const [borrowingTrend, setBorrowingTrend] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [overdueStats, setOverdueStats] = useState({ overdue: 0, dueThisWeek: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsData, trendData, booksData, genreData, overdueData] = await Promise.all([
          getDashboardStats(),
          getBorrowingTrend(6),
          getTopBooks(10),
          getGenreDistribution(),
          getOverdueStats()
        ]);

        setStats(statsData);
        setBorrowingTrend(trendData);
        setTopBooks(booksData);
        setGenreDistribution(genreData);
        setOverdueStats(overdueData);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  const statCards = [
    {
      title: 'Tổng Số Sách',
      value: stats.totalBooks,
      icon: FaBook,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Tổng Thành Viên',
      value: stats.totalMembers,
      icon: FaUsers,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Thẻ Thư Viện',
      value: stats.totalLibraryCards,
      icon: FaIdCard,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Đang Mượn',
      value: stats.borrowingCount,
      icon: FaExchangeAlt,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      title: 'Trả Hôm Nay',
      value: stats.returnsToday,
      icon: FaCheckCircle,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold">Tổng Quan</h2>
        <p className="text-muted">
          Chào mừng đến với Hệ Thống Quản Lý Thư Viện
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={4} xl>
            <Card className="border-0 shadow-sm h-100" style={{ background: stat.gradient }}>
              <Card.Body className="text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-white-50 mb-1">{stat.title}</h6>
                    <h2 className="mb-0 fw-bold">{stat.value}</h2>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    <stat.icon size={28} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Alert Cards */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm border-start border-danger border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaExclamationTriangle className="text-danger me-3" size={32} />
                <div>
                  <h6 className="text-muted mb-1">Sách Quá Hạn</h6>
                  <h3 className="mb-0 text-danger fw-bold">{overdueStats.overdue}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm border-start border-warning border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FaClock className="text-warning me-3" size={32} />
                <div>
                  <h6 className="text-muted mb-1">Sắp Hết Hạn (7 ngày)</h6>
                  <h3 className="mb-0 text-warning fw-bold">{overdueStats.dueThisWeek}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Xu Hướng Mượn Sách (6 tháng gần đây)</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={borrowingTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Số lượt mượn" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Phân Bố Thể Loại</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genreDistribution}
                    dataKey="count"
                    nameKey="genre"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {genreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Top 10 Sách Được Mượn Nhiều Nhất</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topBooks} margin={{ bottom: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="bookTitle" 
                    angle={-45} 
                    textAnchor="end" 
                    height={150}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="borrowCount" fill="#82ca9d" name="Số lượt mượn" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">Thao Tác Nhanh</h5>
              <p className="text-muted mb-0">
                Sử dụng menu điều hướng bên trái để quản lý sách, thành viên và hồ sơ mượn trả.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
