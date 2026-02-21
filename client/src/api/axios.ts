import axios from 'axios';

// Create axios instance with base URL
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

console.log('Using API URL:', apiUrl);

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not defined. Defaulting to localhost in production!');
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear authentication state
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
