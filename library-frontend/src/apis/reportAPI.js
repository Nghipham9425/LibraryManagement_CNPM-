import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const reportAPI = {
  // Get damaged/lost books report
  getDamagedBooks: async (year) => {
    const url = year ? `/reports/damaged-books?year=${year}` : '/reports/damaged-books';
    const response = await api.get(url);
    return response.data;
  },
};

export default reportAPI;
