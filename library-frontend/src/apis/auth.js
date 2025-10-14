import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust to your API URL

export const login = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const refreshToken = async (token) => {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken: token });
  return response.data;
};