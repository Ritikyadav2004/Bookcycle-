import api from './api';
import { delay } from '../utils/helpers';

// Mock auth data to use until backend is ready
const mockAuthUser = {
  id: 'u123',
  name: 'John Doe',
  email: 'john@example.com',
  token: 'mock-jwt-token-xyz',
};

export const authService = {
  // Login as Buyer
  loginBuyer: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return {
      token: res.data.token,
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    };
  },

  // Login as Seller
  loginSeller: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return {
      token: res.data.token,
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    };
  },

  // Login as Admin
  loginAdmin: async (credentials) => {
    const res = await api.post('/auth/admin/login', credentials);
    return {
      token: res.data.token,
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    };
  },

  // Register Buyer
  registerBuyer: async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      mobile: data.mobile || data.phone || "9999999999",
      role: 'buyer'
    };
    const res = await api.post('/auth/register', payload);
    return {
      token: res.data.token,
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    };
  },

  // Register Seller
  registerSeller: async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      mobile: data.phone || data.mobile || "9999999999",
      city: data.city,
      shopName: data.shopName || `${data.name}'s Bookshop`,
      role: 'seller'
    };
    const res = await api.post('/auth/register', payload);
    return {
      token: res.data.token,
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
    };
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset Password
  resetPassword: async (data) => {
    return api.post('/auth/reset-password', data);
  },

  // Update Profile
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', {
      name: data.name,
      email: data.email,
      mobile: data.phone || data.mobile,
      city: data.city
    });
    return res.data;
  },
};

export default authService;
