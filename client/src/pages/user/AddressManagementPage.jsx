import { useEffect, useState } from 'react';
import axios from '../../config/axios';
import Loader from '../../components/shared/Loader';
import { toast } from 'react-hot-toast';

const emptyForm = { Address: '', street: '', city: '', state: '', pincode: '' };

const AddressManagementPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/address');
      setAddresses(res.data.addresses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/address/${editingId}`, form);
        toast.success('Address updated');
      } else {
        await axios.post('/address', form);
        toast.success('Address added');
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save address';
      toast.error(msg);
    }
  };

  const handleEdit = (addr) => {
    setForm({ Address: addr.Address, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode });
    setEditingId(addr._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await axios.delete(`/address/${id}`);
      toast.success('Address deleted');
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete address';
      toast.error(msg);
    }
  };

  if (loading) return <Loader className="min-h-screen" />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Addresses</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <input className="border p-2 rounded" placeholder="Label (e.g. Home)" value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Street" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
        <input className="border p-2 rounded" placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          {editingId ? 'Update Address' : 'Add Address'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="border px-4 py-2 rounded-md">Cancel</button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <div key={addr._id} className="bg-white p-4 rounded-md shadow-md">
            <div className="font-semibold text-gray-900">{addr.Address}</div>
            <div className="text-gray-700">{addr.street}, {addr.city}</div>
            <div className="text-gray-700">{addr.state} - {addr.pincode}</div>
            <div className="mt-3 flex gap-3">
              <button onClick={() => handleEdit(addr)} className="px-3 py-1 rounded bg-gray-100">Edit</button>
              <button onClick={() => handleDelete(addr._id)} className="px-3 py-1 rounded bg-red-500 text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressManagementPage;


