import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useSellerAuthStore from './store/sellerAuthStore';
import useAdminAuthStore from './store/adminAuthStore';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import OtpVerificationPage from './pages/user/OtpVerificationPage';
import PrivateRoute from './routes/PrivateRoute';
import UserLayout from './layouts/user/UserLayout';
import SellerLoginPage from './pages/seller/SellerLoginPage';
import SellerRegisterPage from './pages/seller/SellerRegisterPage';
import SellerOtpVerificationPage from './pages/seller/SellerOtpVerificationPage';
import SellerPrivateRoute from './routes/SellerPrivateRoute';
import SellerLayout from './layouts/seller/SellerLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminPrivateRoute from './routes/AdminPrivateRoute';
import AdminLayout from './layouts/admin/AdminLayout';

const App = () => {
  const initializeUserAuth = useAuthStore((state) => state.initializeAuth);
  const initializeSellerAuth = useSellerAuthStore((state) => state.initializeAuth);
  const initializeAdminAuth = useAdminAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeUserAuth();
    initializeSellerAuth();
    initializeAdminAuth();
  }, [initializeUserAuth, initializeSellerAuth, initializeAdminAuth]);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* User Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />

        {/* Seller Auth Routes */}
        <Route path="/seller/login" element={<SellerLoginPage />} />
        <Route path="/seller/register" element={<SellerRegisterPage />} />
        <Route path="/seller/verify-otp" element={<SellerOtpVerificationPage />} />

        {/* Admin Auth Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        {/* User Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<div>Welcome to ShopyZone!</div>} />
            {/* Add more user-specific routes here */}
          </Route>
        </Route>

        {/* Seller Private Routes */}
        <Route element={<SellerPrivateRoute />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<div>Welcome to Seller Dashboard!</div>} />
            {/* Add more seller-specific routes here */}
          </Route>
        </Route>

        {/* Admin Private Routes */}
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Welcome to Admin Dashboard!</div>} />
            {/* Add more admin-specific routes here */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;