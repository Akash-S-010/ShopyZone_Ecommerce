import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import Loader from '../../components/shared/Loader';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/address');
      setAddresses(res.data.addresses);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddEditAddress = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAddress = {
      Address: formData.get('Address'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      pincode: formData.get('pincode'),
      country: formData.get('country'),
    };

    try {
      if (editingAddress) {
        await axios.put(`/address/${editingAddress._id}`, newAddress);
        toast.success('Address updated successfully');
      } else {
        await axios.post('/address', newAddress);
        toast.success('Address added successfully');
      }
      setShowForm(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`/address/${id}`);
        toast.success('Address deleted successfully');
        fetchAddresses();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  if (loading) return <Loader className="min-h-screen" />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>

      <button
        onClick={() => { setShowForm(true); setEditingAddress(null); }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center mb-4"
      >
        <Plus className="w-5 h-5 mr-2" /> Add New Address
      </button>

      {showForm && (
        <div className="bg-white p-4 rounded-md shadow mb-4">
          <h2 className="text-xl font-bold mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
          <form onSubmit={handleAddEditAddress} className="space-y-4">
            <input type="text" name="Address" placeholder="Address Line 1" defaultValue={editingAddress?.Address || ''} className="w-full p-2 border rounded-md" required />
            <input type="text" name="street" placeholder="Street" defaultValue={editingAddress?.street || ''} className="w-full p-2 border rounded-md" required />
            <input type="text" name="city" placeholder="City" defaultValue={editingAddress?.city || ''} className="w-full p-2 border rounded-md" required />
            <input type="text" name="state" placeholder="State" defaultValue={editingAddress?.state || ''} className="w-full p-2 border rounded-md" required />
            <input type="text" name="pincode" placeholder="Pincode" defaultValue={editingAddress?.pincode || ''} className="w-full p-2 border rounded-md" required />
            <input type="hidden" name="country" value="India" />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Save Address</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <p>No addresses found. Please add a new address.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address._id} className="bg-white p-4 rounded-md shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{address.street}, {address.city}</p>
                <p>{address.state} - {address.pincode}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingAddress(address); setShowForm(true); }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressPage;