import { useEffect, useState } from 'react';
import axios from '../../config/axios';
import Loader from '../../components/shared/Loader';
import { toast } from 'react-hot-toast';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/my-orders');
        setOrders(data || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <Loader className="min-h-screen" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded-md shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
                <span className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700">Total: ₹{order.totalPrice.toFixed(2)}</p>
              <p className="text-gray-700">Order Status: {order.orderStatus}</p>
              <p className="text-gray-700">Payment Status: {order.paymentStatus}</p>
              <div className="mt-2">
                <h3 className="font-medium">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item) => (
                    <li key={item._id} className="text-sm text-gray-600">
                      {item.product?.name} x {item.quantity} - ₹{(item.product?.discountPrice || item.product?.price || 0).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;


