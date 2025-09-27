import React, { useState } from 'react';
import useSellerAuthStore from '../../store/sellerAuthStore';
import { User } from 'lucide-react'; // For the profile icon
import EditSellerProfileForm from '../../components/seller/EditSellerProfileForm';
import { toast } from 'react-hot-toast';

const SellerProfilePage = () => {
  const { seller, updateSellerProfile, isLoading } = useSellerAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = async (formData) => {
    const result = await updateSellerProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Profile</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Your profile information</p>

        {seller ? (
          isEditing ? (
            <EditSellerProfileForm
              initialData={seller}
              onSubmit={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-gray-200 rounded-full p-4">
                  <User className="h-16 w-16 text-gray-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
                  <input
                    type="text"
                    id="shopName"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                    value={seller?.shopName || 'N/A'}
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                    value={seller?.email || 'N/A'}
                    readOnly
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
                    value={seller?.phone || 'N/A'}
                    readOnly
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Account Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Registration Status</span>
                    <span className={`${seller?.status === 'approved' ? 'text-green-600' : seller?.status === 'pending' ? 'text-yellow-600' : 'text-red-600'} font-semibold`}>{seller?.status || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Business Address</span>
                    <span className="text-gray-600">
                      {seller?.businessAddress ? 
                        `${seller.businessAddress.street || ''}, ${seller.businessAddress.city || ''}, ${seller.businessAddress.state || ''} - ${seller.businessAddress.pincode || ''}, ${seller.businessAddress.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/\s*,$/,'')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Member Since</span>
                    <span className="text-gray-600">September 2023</span> {/* Placeholder */}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </>
          )
        ) : (
          <p className="text-center text-lg mt-8">Loading seller profile...</p>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;
