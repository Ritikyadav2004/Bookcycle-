import axios from 'axios';
import { API_BASE_URL } from '../constants';
import useAuthStore from '../store/authStore';

// Create central Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const currentRole = useAuthStore.getState().role;
      useAuthStore.getState().logout();
      if (currentRole === 'admin' || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    
    // Format error message consistently
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default api;
