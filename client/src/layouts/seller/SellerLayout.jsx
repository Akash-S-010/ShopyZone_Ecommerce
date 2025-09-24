import { Outlet, Link, useNavigate } from 'react-router-dom';
import useSellerAuthStore from '../../store/sellerAuthStore';
import { LogOut, Home, Package, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
// import logo from '../../assets/logo.png';

const SellerLayout = () => {
  const navigate = useNavigate();
  const { logoutSeller, seller } = useSellerAuthStore();

  const handleLogout = async () => {
    const result = await logoutSeller();
    if (result.success) {
      navigate('/seller/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/seller" className="flex items-center space-x-2">
            <img src="" alt="ShopyZone Seller Logo" className="h-8" />
            <span className="text-xl font-bold text-gray-800">ShopyZone Seller</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/seller" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/seller/products" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <Package className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link to="/seller/profile" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <UserIcon className="h-5 w-5" />
            <span>{seller?.shopName || 'Profile'}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-red-600 hover:text-red-800 focus:outline-none"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p>© {new Date().getFullYear()} ShopyZone Seller. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SellerLayout;
