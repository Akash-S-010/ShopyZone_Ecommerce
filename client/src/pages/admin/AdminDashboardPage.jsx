import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminAuthStore from '../../store/adminAuthStore';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import { Users, Store, Package } from 'lucide-react';
import Loader from '../../components/shared/Loader';

const AdminDashboardPage = () => {
  const { admin } = useAdminAuthStore();
  const [userCount, setUserCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch total users
        const usersRes = await axios.get('/admin/users');
        setUserCount(usersRes.data.length);

        // Fetch total sellers
        const sellersRes = await axios.get('/admin/sellers');
        setSellerCount(sellersRes.data.length);

        // Fetch total products
        const productsRes = await axios.get('/admin/products/count');
        setProductCount(productsRes.data.count);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        toast.error(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (admin) {
      fetchData();
    }
  }, [admin]);

  if (isLoading) {
    return <Loader className="min-h-screen" />;
  }

  if (error) {
    return <div className="text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome, {admin?.name || 'Admin'}!</h2>
        <p className="text-gray-600 text-lg">Admin Dashboard Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <Link to="/admin/users" className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105 cursor-pointer">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{userCount}</p>
          </div>
          <Users className="text-indigo-500" size={48} />
        </Link>

        {/* Total Sellers Card */}
        <Link to="/admin/sellers" className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105 cursor-pointer">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Sellers</p>
            <p className="text-3xl font-bold text-gray-900">{sellerCount}</p>
          </div>
          <Store className="text-green-500" size={48} />
        </Link>

        {/* Total Products Card */}
        <Link to="/admin/products" className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105 cursor-pointer">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{productCount}</p>
          </div>
          <Package className="text-blue-500" size={48} />
        </Link>
      </div>

      {/* Optional: Recent Activity, Orders Summary, etc. */}
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <p className="text-gray-600">No recent activity to display.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
