import React from 'react';
import useAuthStore from '../../store/authStore';
import { User } from 'lucide-react'; // For the profile icon

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Profile</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Your profile information</p>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full p-4">
            <User className="h-16 w-16 text-gray-600" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              id="userName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
              value={user?.name || 'Jane Doe'} // Placeholder if user name is not available
              readOnly
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"
              value={user?.email || 'akashspalloor@gmail.com'} // Placeholder if email is not available
              readOnly
            />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Account Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Member Since</span>
              <span className="text-gray-600">September 2023</span> {/* Placeholder */}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Account Status</span>
              <span className="text-green-600 font-semibold">Active</span> {/* Placeholder */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
