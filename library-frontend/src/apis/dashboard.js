import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`, { withCredentials: true });
  return response.data;
};