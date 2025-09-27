import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';
import Loader from '../../components/shared/Loader';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/admin/sellers');
      setSellers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sellers');
      toast.error(err.response?.data?.message || 'Failed to fetch sellers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleUpdateStatus = async (sellerId, status) => {
    try {
      const res = await axios.patch(`/admin/seller/${sellerId}/update-status`, { status });
      toast.success(res.data.message);
      // Optimistically update UI or refetch sellers
      setSellers(prevSellers =>
        prevSellers.map(seller =>
          seller._id === sellerId ? { ...seller, status: status } : seller
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update seller status');
    }
  };

  if (isLoading) {
    return <Loader className="min-h-screen" />;
  }

  if (error) {
    return <div className="text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-900';
      case 'approved':
        return 'bg-green-200 text-green-900';
      case 'rejected':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Sellers</h2>

      {sellers.length === 0 ? (
        <p className="text-gray-600 text-center">No sellers found.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Shop Name</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{seller.shopName}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{seller.email}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{seller.phone}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${getStatusClasses(seller.status)}`}>
                      <span aria-hidden="true" className={`absolute inset-0 opacity-50 rounded-full ${getStatusClasses(seller.status).split(' ')[0].replace('text','bg')}`}></span>
                      <span className="relative">{seller.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {seller.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(seller._id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-xs font-semibold transition-colors duration-200"
                        >
                          <CheckCircle size={16} className="inline-block mr-1" color="white" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(seller._id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full text-xs font-semibold transition-colors duration-200"
                        >
                          <XCircle size={16} className="inline-block mr-1" color="white" />
                          Reject
                        </button>
                      </div>
                    )}
                    {(seller.status === 'approved' || seller.status === 'rejected') && (
                        <button
                        onClick={() => handleUpdateStatus(seller._id, seller.status === 'approved' ? 'rejected' : 'approved')}
                        className={`text-white py-2 px-4 rounded-full text-xs font-semibold transition-colors duration-200 ${seller.status === 'approved' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {seller.status === 'approved' ? (
                            <><XCircle size={16} className="inline-block mr-1" color="white" /> Reject</>
                        ) : (
                            <><CheckCircle size={16} className="inline-block mr-1" color="white" /> Approve</>
                        )}
                      </button>
                    )}
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

export default AdminSellersPage;

