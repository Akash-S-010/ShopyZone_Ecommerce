import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import Loader from '../../components/shared/Loader';

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/orders/seller');
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/seller/status`, { orderId, status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (isLoading) {
    return <Loader className="min-h-screen" />;
  }

  if (error) {
    return <div className="text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Customer Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found for your products.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Products</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order._id}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-2">
                        <img src={item.product.images && item.product.images.length > 0 && item.product.images[0].url ? item.product.images[0].url : 'https://via.placeholder.com/150'} alt={item.product.name} className="w-10 h-10 object-cover rounded-md" />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{order.user?.name || 'N/A'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">₹{order.totalPrice?.toFixed(2)}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${order.orderStatus === 'Delivered' ? 'text-green-900' : order.orderStatus === 'Shipped' ? 'text-blue-900' : order.orderStatus === 'Pending' ? 'text-yellow-900' : 'text-red-900'}`}>
                      <span aria-hidden="true" className={`absolute inset-0 opacity-50 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-200' : order.orderStatus === 'Shipped' ? 'bg-blue-200' : order.orderStatus === 'Pending' ? 'bg-yellow-200' : 'bg-red-200'}`}></span>
                      <span className="relative">{order.orderStatus}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerOrdersPage;