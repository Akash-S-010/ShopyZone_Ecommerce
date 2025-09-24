import { Outlet, Navigate } from 'react-router-dom';
import useSellerAuthStore from '../store/sellerAuthStore';

const SellerPrivateRoute = () => {
  const { isAuthenticated, isLoading, hasCheckedAuth } = useSellerAuthStore();

  if (!hasCheckedAuth) {
    return <div>Loading seller authentication...</div>; // Or a more sophisticated loading spinner
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/seller/login" replace />;
};

export default SellerPrivateRoute;

