import { create } from 'zustand';
import axios from '../config/axios.js';
import { toast } from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  hasCheckedAuth: false,

  // Initialize authentication state from local storage or by checking the backend
  initializeAuth: async () => {
    try {
      const res = await axios.get('/user/get-user');
      set({ user: res.data, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false, error: error.response?.data?.message || 'Failed to initialize authentication', hasCheckedAuth: true });
      console.error("Auth initialization failed", error);
    }
  },

  // User registration action
  registerUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/user/register', userData);
      toast.success(res.data.message);
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // User login action
  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/user/login', credentials);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Verify OTP action
  verifyUserOtp: async (otpData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/user/verify-otp', otpData);
      set({ isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Resend OTP action
  resendUserOtp: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/user/resend-otp', { email });
      set({ isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Forgot password action
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/user/forgot-password', { email });
      toast.success(res.data.message);
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset initiation failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Reset password action (OTP based)
  resetPassword: async (email, otp, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/user/reset-password', { email, otp, newPassword });
      toast.success(res.data.message);
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // User logout action
  logoutUser: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/user/logout');
      set({ user: null, isAuthenticated: false, isLoading: false });
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Logout failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Clear authentication error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
