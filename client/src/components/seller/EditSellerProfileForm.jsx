import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loader from '../shared/Loader';

const EditSellerProfileForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    shopName: '',
    phone: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India', // Default to India
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        shopName: initialData.shopName || '',
        phone: initialData.phone || '',
        businessAddress: {
          street: initialData.businessAddress?.street || '',
          city: initialData.businessAddress?.city || '',
          state: initialData.businessAddress?.state || '',
          pincode: initialData.businessAddress?.pincode || '',
          country: 'India', // Default to India
        },
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('businessAddress.') && name !== 'businessAddress.country') {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        businessAddress: {
          ...prev.businessAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
        <input type="text" id="shopName" name="shopName" value={formData.shopName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>

      <h4 className="text-lg font-medium text-gray-900 mb-2">Business Address</h4>
      <div>
        <label htmlFor="businessAddress.street" className="block text-sm font-medium text-gray-700">Street</label>
        <input type="text" id="businessAddress.street" name="businessAddress.street" value={formData.businessAddress.street} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="businessAddress.city" className="block text-sm font-medium text-gray-700">City</label>
        <input type="text" id="businessAddress.city" name="businessAddress.city" value={formData.businessAddress.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="businessAddress.state" className="block text-sm font-medium text-gray-700">State</label>
        <input type="text" id="businessAddress.state" name="businessAddress.state" value={formData.businessAddress.state} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="businessAddress.pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
        <input type="text" id="businessAddress.pincode" name="businessAddress.pincode" value={formData.businessAddress.pincode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div className="flex justify-between items-center">
        <span className="block text-sm font-medium text-gray-700">Country</span>
        <span className="text-gray-800 font-semibold">India</span>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {isLoading ? <Loader size={20} className="inline-block mr-2" colorClass="text-white" /> : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditSellerProfileForm;
