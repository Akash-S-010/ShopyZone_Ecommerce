import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import PrivateRoute from './routes/PrivateRoute';
import UserLayout from './layouts/user/UserLayout';

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<UserLayout />}>
            {/* User specific routes will go here */}
            <Route index element={<div>Welcome to ShopyZone!</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;