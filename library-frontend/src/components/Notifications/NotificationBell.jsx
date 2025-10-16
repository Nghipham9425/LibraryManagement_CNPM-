import { useState, useEffect } from 'react'
import { Dropdown, Badge, ListGroup, Button } from 'react-bootstrap'
import { FaBell, FaCheck, FaCheckDouble } from 'react-icons/fa'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { toast } from 'react-toastify'
import { notificationAPI } from '../../apis/notificationAPI'

const NotificationBell = ({ libraryCardId = 1 }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [notifs, count] = await Promise.all([
          notificationAPI.getNotifications(libraryCardId, 1, 10),
          notificationAPI.getUnreadCount(libraryCardId)
        ])
        setNotifications(notifs)
        setUnreadCount(count)
      } catch {
        console.error('Error fetching notifications')
      }
    }

    fetchNotifications()
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [libraryCardId])

  const refreshNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        notificationAPI.getNotifications(libraryCardId, 1, 10),
        notificationAPI.getUnreadCount(libraryCardId)
      ])
      setNotifications(notifs)
      setUnreadCount(count)
    } catch {
      console.error('Error fetching notifications')
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId, libraryCardId)
      await refreshNotifications()
    } catch {
      toast.error('Lỗi khi đánh dấu đã đọc')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(libraryCardId)
      toast.success('Đã đánh dấu tất cả là đã đọc')
      await refreshNotifications()
    } catch {
      toast.error('Lỗi khi đánh dấu tất cả')
    }
  }

  const getTypeIcon = (type) => {
    const icons = {
      BorrowSuccess: '🎉',
      ReturnSuccess: '✅',
      RenewSuccess: '📅',
      DueSoon: '⏰',
      Overdue: '⚠️',
      General: '📢'
    }
    return icons[type] || '📢'
  }

  const getTypeColor = (type) => {
    const colors = {
      BorrowSuccess: '#28a745',
      ReturnSuccess: '#17a2b8',
      RenewSuccess: '#007bff',
      DueSoon: '#ffc107',
      Overdue: '#dc3545',
      General: '#6c757d'
    }
    return colors[type] || '#6c757d'
  }

  return (
    <Dropdown show={show} onToggle={(isOpen) => setShow(isOpen)} align="end">
      <Dropdown.Toggle 
        as="div" 
        className="position-relative cursor-pointer p-2"
        style={{ cursor: 'pointer' }}
      >
        <FaBell size={24} className="text-white" />
        {unreadCount > 0 && (
          <Badge
            pill
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: '0.7rem' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: '380px', maxHeight: '500px', overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
          <h6 className="mb-0 fw-bold">Thông báo</h6>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="link"
              className="text-decoration-none p-0"
              onClick={handleMarkAllAsRead}
            >
              <FaCheckDouble className="me-1" />
              Đánh dấu tất cả
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaBell size={48} className="mb-3 opacity-50" />
            <p className="mb-0">Chưa có thông báo nào</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((notif) => (
              <ListGroup.Item
                key={notif.id}
                className={`border-0 ${!notif.isRead ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              >
                <div className="d-flex gap-3">
                  <div
                    className="flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: getTypeColor(notif.type),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}
                  >
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>
                        {notif.title}
                      </h6>
                      {!notif.isRead && (
                        <Badge bg="primary" pill style={{ fontSize: '0.65rem' }}>
                          Mới
                        </Badge>
                      )}
                    </div>
                    <p className="mb-1 text-muted" style={{ fontSize: '0.85rem' }}>
                      {notif.message}
                    </p>
                    {notif.bookTitle && notif.bookImageUrl && (
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <img
                          src={notif.bookImageUrl}
                          alt={notif.bookTitle}
                          style={{
                            width: 30,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                        <small className="text-muted">{notif.bookTitle}</small>
                      </div>
                    )}
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: vi
                      })}
                    </small>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Dropdown.Divider />
        <div className="text-center py-2">
          <a href="/notifications" className="text-decoration-none small">
            Xem tất cả thông báo
          </a>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default NotificationBell
