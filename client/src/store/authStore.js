import { create } from 'zustand';
import axiosInstance from '../config/axios.js';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  hasCheckedAuth: false, // check  for status of auth check and prevent flicker on protected routes

  // User Login
  login: async (login, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/users/login', { login, password });
      set({ user: response.data.user, token: response.data.token, loading: false });
      localStorage.setItem('token', response.data.token);
      // Optionally, store user data in local storage as well
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  // User Registration
  register: async (name, email, password, phone) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/user/register', { name, email, password, phone });
      set({ user: response.data.user, token: response.data.token, loading: false });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      return false;
    }
  },

  // User Logout
  logout: () => {
    set({ user: null, token: null, hasCheckedAuth: true });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Initialize auth state from local storage
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: JSON.parse(user), hasCheckedAuth: true });
    } else {
      set({ hasCheckedAuth: true });
    }
  },
}));

export default useAuthStore;