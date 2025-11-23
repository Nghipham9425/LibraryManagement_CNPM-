import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, { withCredentials: true });
  return response.data;
};

export const getBorrowingTrend = async (months = 6) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/borrowing-trend?months=${months}`, { withCredentials: true });
  return response.data;
};

export const getTopBooks = async (limit = 10) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/top-books?limit=${limit}`, { withCredentials: true });
  return response.data;
};

export const getGenreDistribution = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/genre-distribution`, { withCredentials: true });
  return response.data;
};

export const getOverdueStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/overdue-stats`, { withCredentials: true });
  return response.data;
};