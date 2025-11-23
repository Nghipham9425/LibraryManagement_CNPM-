import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Debug: Log API URL being used
console.log('🔍 API_BASE_URL:', API_BASE_URL);
console.log('🔍 REACT_APP_API_BASE_URL env:', import.meta.env.VITE_API_BASE_URL);

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, { withCredentials: true });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, { withCredentials: true });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/me`, { withCredentials: true });
  return response.data;
};