import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Gửi cookie tự động
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data)
    } else if (error.request) {
      console.error("Network Error:", error.message)
    } else {
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  }
)

export const bookAPI = {
  getAll: async () => {
    const response = await api.get("/books")
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/books/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post("/books", data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/books/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },
  search: async (params) => {
    const response = await api.get("/books/search", { params })
    return response.data
  },
}

export const memberAPI = {
  getAll: () => api.get("/members"),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post("/members", data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
}

export const authorAPI = {
  getAll: async () => {
    const response = await api.get("/authors")
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/authors/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post("/authors", data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/authors/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/authors/${id}`)
    return response.data
  },
}

export const genreAPI = {
  getAll: async () => {
    const response = await api.get("/genres")
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/genres/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await api.post("/genres", data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/genres/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/genres/${id}`)
    return response.data
  },
}

export const borrowingAPI = {
  getActive: async (libraryCardId) => {
    const response = await api.get(`/borrowings/active/${libraryCardId}`)
    return response.data
  },
  getHistory: async (libraryCardId) => {
    const response = await api.get(`/borrowings/history/${libraryCardId}`)
    return response.data
  },
  getOverdue: async (libraryCardId) => {
    const response = await api.get(`/borrowings/overdue/${libraryCardId}`)
    return response.data
  },
  borrow: async (data) => {
    const response = await api.post("/borrowings/borrow", data)
    return response.data
  },
  returnBook: async (data) => {
    const response = await api.post("/borrowings/return", data)
    return response.data
  },
  renew: async (data) => {
    const response = await api.post("/borrowings/renew", data)
    return response.data
  },
  reportLost: async (borrowingId) => {
    const response = await api.post(`/borrowings/${borrowingId}/report-lost`)
    return response.data
  },
  reportDamaged: async (borrowingId) => {
    const response = await api.post(`/borrowings/${borrowingId}/report-damaged`)
    return response.data
  },
}

export const userAPI = {
  getAll: async () => {
    const response = await api.get("/users")
    return response.data
  },
  getById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  getMe: async () => {
    const response = await api.get("/users/me")
    return response.data
  },
  updateMe: async (data) => {
    const response = await api.put("/users/me", data)
    return response.data
  },
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post("/users/change-password", { currentPassword, newPassword })
    return response.data
  },
  create: async (data) => {
    const response = await api.post("/users", data)
    return response.data
  },
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
  activate: async (id) => {
    const response = await api.post(`/users/${id}/activate`)
    return response.data
  },
}

export const bookItemAPI = {
  // Lấy tất cả bản sao của một sách
  getAllByBookId: async (bookId) => {
    const response = await api.get(`/books/${bookId}/items`)
    return response.data
  },
  // Lấy chi tiết một bản sao
  getById: async (bookId, itemId) => {
    const response = await api.get(`/books/${bookId}/items/${itemId}`)
    return response.data
  },
  // Thêm bản sao mới
  create: async (bookId, data) => {
    const response = await api.post(`/books/${bookId}/items`, data)
    return response.data
  },
  // Cập nhật trạng thái bản sao
  update: async (bookId, itemId, data) => {
    const response = await api.put(`/books/${bookId}/items/${itemId}`, data)
    return response.data
  },
  // Xóa bản sao
  delete: async (bookId, itemId) => {
    const response = await api.delete(`/books/${bookId}/items/${itemId}`)
    return response.data
  },
}

export const reportAPI = {
  // Get damaged/lost books report
  getDamagedBooks: async (year) => {
    const url = year ? `/reports/damaged-books?year=${year}` : '/reports/damaged-books'
    const response = await api.get(url)
    return response.data
  },
}

export const settingsAPI = {
  getAll: async () => {
    const response = await api.get('/settings')
    return response.data
  },
  getByKey: async (key) => {
    const response = await api.get(`/settings/${key}`)
    return response.data
  },
  update: async (key, value) => {
    const response = await api.put(`/settings/${key}`, { value })
    return response.data
  },
}

export const activityLogsAPI = {
  // Get all logs with filters
  getAll: async (params = {}) => {
    const response = await api.get('/activitylogs', { params })
    return response.data
  },
  // Get recent logs
  getRecent: async (count = 10) => {
    const response = await api.get(`/activitylogs/recent?count=${count}`)
    return response.data
  },
  // Get logs by user
  getByUser: async (userId, limit = 50) => {
    const response = await api.get(`/activitylogs/user/${userId}?limit=${limit}`)
    return response.data
  },
  // Get statistics
  getStats: async () => {
    const response = await api.get('/activitylogs/stats')
    return response.data
  },
}

