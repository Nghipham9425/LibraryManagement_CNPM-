import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const libraryCardAPI = {
  // Get all library cards (Admin/Librarian only)
  getAll: async () => {
    const response = await api.get('/librarycards');
    return response.data;
  },

  // Get library card by ID (Admin/Librarian only)
  getById: async (id) => {
    const response = await api.get(`/librarycards/${id}`);
    return response.data;
  },

  // Get current user's library card
  getMyCard: async () => {
    const response = await api.get('/librarycards/my-card');
    return response.data;
  },

  // User tự đăng ký thẻ thư viện
  register: async (data) => {
    const response = await api.post('/librarycards/register', data);
    return response.data;
  },

  // Create new library card (Admin/Librarian only)
  create: async (data) => {
    const response = await api.post('/librarycards', data);
    return response.data;
  },

  // Update library card (Admin/Librarian only)
  update: async (id, data) => {
    const response = await api.put(`/librarycards/${id}`, data);
    return response.data;
  },

  // Delete library card (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/librarycards/${id}`);
    return response.data;
  },

  // Renew library card (Admin/Librarian only)
  renew: async (id, months = 12) => {
    const response = await api.post(`/librarycards/${id}/renew?months=${months}`);
    return response.data;
  },

  // Get unpaid fines for a library card (Admin/Librarian only)
  getUnpaidFines: async (id) => {
    const response = await api.get(`/librarycards/${id}/unpaid-fines`);
    return response.data;
  },

  // Compensate and reactivate card (Admin/Librarian only)
  compensate: async (id, data) => {
    const response = await api.post(`/librarycards/${id}/compensate`, data);
    return response.data;
  },
};

export default libraryCardAPI;
