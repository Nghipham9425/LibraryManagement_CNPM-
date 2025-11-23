
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const notificationAPI = {
  getNotifications: async (libraryCardId, page = 1, pageSize = 20) => {
    const response = await api.get(`/notifications/${libraryCardId}`, {
      params: { page, pageSize }
    })
    return response.data
  },
  getUnreadCount: async (libraryCardId) => {
    const response = await api.get(`/notifications/${libraryCardId}/unread-count`)
    return response.data.count
  },
  markAsRead: async (notificationId, libraryCardId) => {
    const response = await api.post(`/notifications/${notificationId}/mark-read`, null, {
      params: { libraryCardId }
    })
    return response.data
  },
  markAllAsRead: async (libraryCardId) => {
    const response = await api.post(`/notifications/${libraryCardId}/mark-all-read`)
    return response.data
  },
}

export default notificationAPI
