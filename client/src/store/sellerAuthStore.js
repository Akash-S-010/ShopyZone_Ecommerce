import { create } from 'zustand';
import axios from '../config/axios.js';
import { toast } from 'react-hot-toast';

const useSellerAuthStore = create((set) => ({
  seller: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  hasCheckedAuth: false,

  initializeAuth: async () => {
    try {
      const res = await axios.get('/seller/get-seller');
      set({ seller: res.data, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
    } catch (error) {
      set({ seller: null, isAuthenticated: false, isLoading: false, error: error.response?.data?.message || 'Failed to initialize seller authentication', hasCheckedAuth: true });
      console.error("Seller Auth initialization failed", error);
    }
  },

  registerSeller: async (sellerData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/seller/signup', sellerData);
      toast.success(res.data.message);
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Seller registration failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  loginSeller: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/seller/login', credentials);
      set({ seller: res.data.seller, isAuthenticated: true, isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Seller login failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  verifySellerOtp: async (otpData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/seller/verify-otp', otpData);
      set({ isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Seller OTP verification failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  resendSellerOtp: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/seller/resend-otp', { email });
      set({ isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend seller OTP';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  logoutSeller: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/seller/logout');
      set({ seller: null, isAuthenticated: false, isLoading: false });
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Seller logout failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  clearError: () => set({ error: null }),

  updateSellerProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put('/seller/profile', profileData);
      set({ seller: res.data.seller, isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },
}));

export default useSellerAuthStore;

