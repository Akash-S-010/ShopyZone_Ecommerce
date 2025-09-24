import { Outlet, Navigate } from 'react-router-dom';
import useAdminAuthStore from '../store/adminAuthStore';

const AdminPrivateRoute = () => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAdminAuthStore();

  if (!hasCheckedAuth) {
    return <div>Loading admin authentication...</div>; // Or a more sophisticated loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;

