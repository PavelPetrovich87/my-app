import axios from 'axios';
import { authService } from '../services/auth.service';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Base URL for your API
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = await authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      // Logic to refresh token or redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient; 