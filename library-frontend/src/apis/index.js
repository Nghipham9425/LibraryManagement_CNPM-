import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
export const authAPI = {
  register: async (userData) => {
    // userData là object chứa { name, email, password }
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    // credentials là object chứa { email, password }
    const response = await api.post("/auth/login", credentials);
    return response.data; // Giả sử backend trả về { user: {...}, token: '...' }
  },
};
export const genreAPI = {
  getAll: async () => {
    const response = await api.get("/genres");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/genres", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/genres/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
  },
};