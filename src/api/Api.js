import axios from 'axios';

const API_BASE_URL = 'https://reqres.in/api';

// Login API
export const loginUser = (email, password) => {
  return axios.post(`${API_BASE_URL}/login`, { email, password });
};

// Get Single User API
export const getUserById = (id) => {
  return axios.get(`${API_BASE_URL}/users/${id}`);
};

// Update User API
export const updateUser = (id, userData) => {
  return axios.put(`${API_BASE_URL}/users/${id}`, userData);
};

// Delete User API
export const deleteUser = (id) => {
  return axios.delete(`${API_BASE_URL}/users/${id}`);
};
