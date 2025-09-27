import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Loader from '../components/shared/Loader';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useAuthStore();

  if (!hasCheckedAuth || isLoading) {
    return <Loader className="min-h-screen" />; // Or a more sophisticated loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;