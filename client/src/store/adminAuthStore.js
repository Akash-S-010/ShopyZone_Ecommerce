import { create } from 'zustand';
import axios from '../config/axios.js';
import { toast } from 'react-hot-toast';

const useAdminAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  hasCheckedAuth: false,

  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get('/admin/get-admin'); // Assuming an admin get route
      set({ admin: res.data, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
    } catch (error) {
      set({ admin: null, isAuthenticated: false, isLoading: false, error: error.response?.data?.message || 'Failed to initialize admin authentication', hasCheckedAuth: true });
      console.error("Admin Auth initialization failed", error);
    }
  },

  registerAdmin: async (adminData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/admin/register', adminData);
      toast.success(res.data.message);
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin registration failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  loginAdmin: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post('/admin/login', credentials);
      set({ admin: res.data.user, isAuthenticated: true, isLoading: false });
      toast.success(res.data.message);
      return { success: true, message: res.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  logoutAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/admin/logout'); // Assuming an admin logout route
      set({ admin: null, isAuthenticated: false, isLoading: false });
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin logout failed';
      toast.error(errorMessage);
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAdminAuthStore;

