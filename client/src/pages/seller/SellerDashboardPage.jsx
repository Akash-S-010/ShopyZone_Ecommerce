import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSellerAuthStore from '../../store/sellerAuthStore';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import { Package, PlusCircle, User } from 'lucide-react';
import Loader from '../../components/shared/Loader';

const SellerDashboardPage = () => {
  const { seller } = useSellerAuthStore();
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [sellerRevenue, setSellerRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndOrderCounts = async () => {
      try {
        setIsLoading(true);
        const productRes = await axios.get('/seller/products');
        setProductCount(productRes.data.length);

        const orderRes = await axios.get('/orders/seller');
        setOrderCount(orderRes.data.length);

        const revenueRes = await axios.get('/orders/seller/revenue');
        setSellerRevenue(revenueRes.data.totalRevenue);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        toast.error(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (seller) {
      fetchProductAndOrderCounts();
    }
  }, [seller]);

  if (isLoading) {
    return <Loader className="min-h-screen" />;
  }

  if (error) {
    return <div className="text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome, {seller?.shopName || 'Seller'}!</h2>
        <p className="text-gray-600 text-lg">Here's a quick overview of your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Products Card */}
        <Link to="/seller/products" className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105 cursor-pointer">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{productCount}</p>
          </div>
          <Package className="text-indigo-500" size={48} />
        </Link>

        {/* Total Revenue Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{sellerRevenue.toFixed(2)}</p>
          </div>
          <Package className="text-green-500" size={48} />
        </div>





        {/* Orders Card */}
        <Link to="/seller/orders" className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105 cursor-pointer">
          <div>
            <p className="text-gray-500 text-sm font-medium">Orders</p>
            <p className="text-3xl font-bold text-gray-900">{orderCount}</p>
          </div>
          <Package className="text-purple-500" size={48} />
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

export default SellerDashboardPage;

