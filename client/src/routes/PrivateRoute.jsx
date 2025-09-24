import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAuthStore();

  if (!hasCheckedAuth) {
    return <div>Loading authentication...</div>; // Or a more sophisticated loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;