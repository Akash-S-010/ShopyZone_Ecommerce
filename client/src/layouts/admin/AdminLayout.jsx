import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAdminAuthStore from '../../store/adminAuthStore';
import { LogOut, Home, Users, Store, Package, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
// import logo from '../../assets/logo.png';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logoutAdmin, admin } = useAdminAuthStore();

  const handleLogout = async () => {
    const result = await logoutAdmin();
    if (result.success) {
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <img src="https://via.placeholder.com/150x50?text=ShopyZone+Admin" alt="ShopyZone Admin Logo" className="h-8" />
            <span className="text-xl font-bold text-gray-800">ShopyZone Admin</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <Users className="h-5 w-5" />
            <span>Users</span>
          </Link>
          <Link to="/admin/sellers" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <Store className="h-5 w-5" />
            <span>Sellers</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <Package className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link to="/admin/profile" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
            <UserIcon className="h-5 w-5" />
            <span>Profile</span>
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
        <p>© {new Date().getFullYear()} ShopyZone Admin. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
