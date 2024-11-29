import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from '../services/auth.service';
import { handleApiError } from '../utils/error.utils';
import { AuthError } from '../types/error.types';

// Create axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request queue for handling token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If there's no config or it's already retried, reject
    if (!originalRequest || !error.response) {
      return Promise.reject(handleApiError(error));
    }

    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      if (originalRequest.url?.includes('/auth/login')) {
        // If login request failed, pass through
        return Promise.reject(new AuthError('Invalid credentials'));
      }

      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      // Here you would implement token refresh logic
      // For now, we'll just handle the error
      try {
        // Clear auth data and reject with auth error
        await authService.removeToken();
        isRefreshing = false;
        processQueue(new AuthError('Session expired'));
        return Promise.reject(new AuthError('Session expired'));
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(handleApiError(error));
  }
);

export default apiClient; 