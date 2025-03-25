// src/api/axios.ts
import axios from 'axios';

// Create axios instance with base URL
const axiosInstance = axios.create({
  // baseURL: 'https://bpm.teratech.co.tz/',
    baseURL: 'http://192.168.8.38:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unauthorized handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;