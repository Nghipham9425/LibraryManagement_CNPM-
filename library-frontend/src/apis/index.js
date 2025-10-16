import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Updated to match the backend port
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
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
  seed: async () => {
    const response = await api.post("/books/seed")
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

// Borrowing APIs for end-user actions
export const borrowingAPI = {
  // Lists
  getActive: async (libraryCardId) => {
    const res = await api.get(`/borrowings/active/${libraryCardId}`)
    return res.data
  },
  getHistory: async (libraryCardId) => {
    const res = await api.get(`/borrowings/history/${libraryCardId}`)
    return res.data
  },
  getOverdue: async (libraryCardId) => {
    const res = await api.get(`/borrowings/overdue/${libraryCardId}`)
    return res.data
  },

  // Actions
  borrow: async ({ LibraryCardId, BookItemId, Days }) => {
    const res = await api.post(`/borrowings/borrow`, { LibraryCardId, BookItemId, Days })
    return res.data
  },
  returnBook: async ({ BorrowingId }) => {
    const res = await api.post(`/borrowings/return`, { BorrowingId })
    return res.data
  },
  renew: async ({ BorrowingId, ExtendDays = 7 }) => {
    const res = await api.post(`/borrowings/renew`, { BorrowingId, ExtendDays })
    return res.data
  },
}

// Test API connection
;(async () => {
  try {
    const response = await bookAPI.getAll()
    console.log("Books fetched successfully:", response)
  } catch (error) {
    console.error("Error fetching books:", error)
  }
})()
