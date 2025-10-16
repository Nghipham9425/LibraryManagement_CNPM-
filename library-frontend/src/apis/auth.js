import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; 

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