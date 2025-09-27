import { Outlet, Navigate } from 'react-router-dom';
import useSellerAuthStore from '../store/sellerAuthStore';
import Loader from '../components/shared/Loader';

const SellerPrivateRoute = () => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useSellerAuthStore();

  if (!hasCheckedAuth || isLoading) {
    return <Loader className="min-h-screen" />; // Or a more sophisticated loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/seller/login" replace />;
};

export default SellerPrivateRoute;

