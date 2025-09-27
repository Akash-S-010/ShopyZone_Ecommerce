import { Outlet, Navigate } from 'react-router-dom';
import useAdminAuthStore from '../store/adminAuthStore';
import Loader from '../components/shared/Loader';

const AdminPrivateRoute = () => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAdminAuthStore();

  if (!hasCheckedAuth) {
    return <Loader className="min-h-screen" />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;

