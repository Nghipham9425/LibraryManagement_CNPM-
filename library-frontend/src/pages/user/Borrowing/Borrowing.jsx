import { useEffect, useMemo, useState, useCallback } from 'react'
import { Card, Button, Container, Tabs, Tab, Table, Modal, Form, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap'
import { FaPlus, FaExchangeAlt, FaRedo, FaCheck, FaInfoCircle } from 'react-icons/fa'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { borrowingAPI, bookAPI } from '../../../apis'
import { useAuth } from '../../../contexts/AuthContext'

// Get library card ID from authenticated user
const useLibraryCardId = () => {
  const { user } = useAuth()
  // User.Id = LibraryCard.Id
  return user?.id || 1
}

const StatusBadge = ({ dueDate }) => {
  const isOverdue = useMemo(() => new Date(dueDate) < new Date(), [dueDate])
  return (
    <Badge bg={isOverdue ? 'danger' : 'success'}>{isOverdue ? 'Quá hạn' : 'Trong hạn'}</Badge>
  )
}

const Borrowing = () => {
  const libraryCardId = useLibraryCardId()
  const [activeKey, setActiveKey] = useState('active')
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState([])
  const [history, setHistory] = useState([])
  const [overdue, setOverdue] = useState([])
  const [showBorrow, setShowBorrow] = useState(false)
  const [books, setBooks] = useState([])
  const [selectedBookItemId, setSelectedBookItemId] = useState('')
  const [days, setDays] = useState(15)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [a, h, o] = await Promise.all([
        borrowingAPI.getActive(libraryCardId),
        borrowingAPI.getHistory(libraryCardId),
        borrowingAPI.getOverdue(libraryCardId),
      ])
      setActive(a)
      setHistory(h)
      setOverdue(o)
    } finally {
      setLoading(false)
    }
  }, [libraryCardId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const openBorrow = async () => {
    setShowBorrow(true)
    try {
      const data = await bookAPI.getAll()
      // Flatten available book items with full book info
      const items = []
      for (const b of data) {
        if (b.bookItems) {
          for (const it of b.bookItems) {
            if (it.status === 'Available' || it.status === 0) {
              items.push({
                id: it.id,
                title: b.title,
                code: it.controlNumber || `#${it.id}`,
                imageUrl: b.imageUrl,
                genre: b.genre,
                authors: b.bookAuthors?.map(ba => ba.authorName).filter(Boolean) || [],
                publicationYear: b.publicationYear,
                publisher: b.publisher
              })
            }
          }
        }
      }
      setBooks(items)
    } catch (err) {
      console.error('Error loading available books:', err)
      setBooks([])
    }
  }

  const doBorrow = async () => {
    if (!selectedBookItemId) return
    try {
      await borrowingAPI.borrow({ LibraryCardId: libraryCardId, BookItemId: Number(selectedBookItemId), Days: Number(days) })
      const book = books.find(b => b.id === Number(selectedBookItemId))
      toast.success(`Mượn sách "${book?.title || 'N/A'}" thành công! 🎉`)
      setShowBorrow(false)
      setSelectedBookItemId('')
      await refresh()
      setActiveKey('active')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi mượn sách')
    }
  }

  const doReturn = async (borrowingId) => {
    if (!window.confirm('Xác nhận trả sách này?')) return
    try {
      await borrowingAPI.returnBook({ BorrowingId: borrowingId })
      toast.success('Trả sách thành công! ✅')
      await refresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi trả sách')
    }
  }

  const doRenew = async (borrowingId) => {
    try {
      await borrowingAPI.renew({ BorrowingId: borrowingId, ExtendDays: 7 })
      toast.success('Gia hạn sách thêm 7 ngày thành công! 📅')
      await refresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gia hạn')
    }
  }

  const EmptyState = ({ title, action }) => (
    <div className="text-center py-5">
      <FaExchangeAlt size={64} className="text-muted mb-3" />
      <h5 className="fw-bold">{title}</h5>
      {action}
    </div>
  )

  const ListTable = ({ data, showActions }) => (
    <Table hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th style={{ minWidth: '250px' }}>Sách</th>
          <th>Mã bản</th>
          <th>Ngày mượn</th>
          <th>Hạn trả</th>
          <th>Trạng thái</th>
          {showActions && <th>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((b, idx) => {
          const book = b.bookItem?.book
          return (
            <tr key={b.id}>
              <td>{idx + 1}</td>
              <td>
                <div className="d-flex align-items-center gap-3">
                  {book?.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      style={{
                        width: 50,
                        height: 70,
                        objectFit: 'cover',
                        borderRadius: 4,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 50,
                        height: 70,
                        backgroundColor: '#e9ecef',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        color: '#6c757d'
                      }}
                    >
                      📚
                    </div>
                  )}
                  <div>
                    <div className="fw-semibold text-dark">{book?.title || 'Không rõ'}</div>
                    <small className="text-muted">
                      {book?.authors?.length > 0 ? book.authors.join(', ') : 'Chưa có tác giả'}
                    </small>
                    {book?.genre && (
                      <div>
                        <Badge bg="light" text="dark" className="mt-1">
                          {book.genre}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <code className="text-muted">{b.bookItem?.controlNumber || b.bookItemId}</code>
              </td>
              <td>{b.borrowDate ? format(new Date(b.borrowDate), 'dd/MM/yyyy') : '—'}</td>
              <td>{b.dueDate ? format(new Date(b.dueDate), 'dd/MM/yyyy') : '—'}</td>
              <td><StatusBadge dueDate={b.dueDate} /></td>
              {showActions && (
                <td>
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => doRenew(b.id)}>
                      <FaRedo className="me-1" /> Gia hạn
                    </Button>
                    <Button size="sm" variant="success" onClick={() => doReturn(b.id)}>
                      <FaCheck className="me-1" /> Trả
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )

  const { user } = useAuth()

  return (
    <Container fluid>
      {/* Welcome Alert */}
      <Alert variant="info" className="mb-4 d-flex align-items-center">
        <FaInfoCircle className="me-2" size={20} />
        <div>
          <strong>Xin chào, {user?.userName}!</strong> Bạn đang xem thông tin mượn/trả sách của tài khoản.
        </div>
      </Alert>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Mượn/Trả của tôi</h2>
          <p className="text-muted mb-0">Quản lý các phiếu mượn của tài khoản độc giả</p>
        </div>
        <Button variant="warning" className="d-flex align-items-center text-white" onClick={openBorrow}>
          <FaPlus className="me-2" />
          Mượn Sách Mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="py-5 text-center"><Spinner animation="border" /></div>
          ) : (
            <Tabs activeKey={activeKey} onSelect={k => setActiveKey(k)} className="mb-3">
              <Tab eventKey="active" title="Đang Mượn">
                {active.length ? (
                  <ListTable data={active} showActions />
                ) : (
                  <EmptyState title="Không Có Sách Đang Mượn" action={
                    <Button variant="outline-warning" className="mt-2 text-warning" onClick={openBorrow}>
                      <FaPlus className="me-2" /> Tạo Phiếu Mượn Mới
                    </Button>
                  } />
                )}
              </Tab>
              <Tab eventKey="history" title="Lịch Sử">
                {history.length ? <ListTable data={history} /> : <EmptyState title="Chưa có lịch sử mượn sách." />}
              </Tab>
              <Tab eventKey="overdue" title="Quá Hạn">
                {overdue.length ? <ListTable data={overdue} /> : <EmptyState title="Không có sách quá hạn." />}
              </Tab>
            </Tabs>
          )}
        </Card.Body>
      </Card>

      <Modal show={showBorrow} onHide={() => setShowBorrow(false)} size="lg">
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title className="d-flex align-items-center">
            <FaPlus className="me-2" />
            Tạo phiếu mượn mới
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Chọn sách muốn mượn</Form.Label>
                  <Form.Select 
                    value={selectedBookItemId} 
                    onChange={e => setSelectedBookItemId(e.target.value)}
                    size="lg"
                  >
                    <option value="">— Chọn sách —</option>
                    {books.map(b => (
                      <option key={b.id} value={b.id}>
                        📖 {b.title} {b.authors && b.authors.length > 0 ? `- ${b.authors.join(', ')}` : ''} (Mã: {b.code})
                      </option>
                    ))}
                  </Form.Select>
                  {books.length === 0 && (
                    <Form.Text className="text-danger">
                      Hiện không có sách nào sẵn sàng để mượn. Vui lòng thử lại sau.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              
              {selectedBookItemId && (() => {
                const selected = books.find(b => b.id === Number(selectedBookItemId))
                return selected ? (
                  <Col md={12}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <div className="d-flex gap-3">
                          {selected.imageUrl ? (
                            <img
                              src={selected.imageUrl}
                              alt={selected.title}
                              style={{
                                width: 80,
                                height: 110,
                                objectFit: 'cover',
                                borderRadius: 6,
                                boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 80,
                                height: 110,
                                backgroundColor: '#dee2e6',
                                borderRadius: 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 36
                              }}
                            >
                              📚
                            </div>
                          )}
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1">{selected.title}</h6>
                            {selected.authors && selected.authors.length > 0 && (
                              <p className="text-muted small mb-1">
                                <strong>Tác giả:</strong> {selected.authors.join(', ')}
                              </p>
                            )}
                            {selected.genre && (
                              <p className="text-muted small mb-1">
                                <strong>Thể loại:</strong> {selected.genre}
                              </p>
                            )}
                            <p className="text-muted small mb-0">
                              <strong>Mã bản:</strong> <code>{selected.code}</code>
                            </p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : null
              })()}
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Số ngày mượn</Form.Label>
                  <Form.Control 
                    type="number" 
                    min={1} 
                    max={60} 
                    value={days} 
                    onChange={e => setDays(e.target.value)}
                    size="lg"
                  />
                  <Form.Text className="text-muted">
                    Tối đa 60 ngày
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Hạn trả dự kiến</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={days ? format(new Date(Date.now() + days * 24 * 60 * 60 * 1000), 'dd/MM/yyyy') : '—'}
                    readOnly
                    size="lg"
                    className="bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShowBorrow(false)}>
            Hủy
          </Button>
          <Button 
            variant="warning" 
            disabled={!selectedBookItemId || books.length === 0} 
            onClick={doBorrow}
            className="text-white"
          >
            <FaPlus className="me-2" />
            Xác nhận mượn
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Borrowing