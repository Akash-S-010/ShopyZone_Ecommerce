import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAdminAuthStore from '../../store/adminAuthStore';
// import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/shared/Loader';
// import logo from '../../assets/logo.png';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const navigate = useNavigate();
  const { loginAdmin, isLoading, isAuthenticated } = useAdminAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/admin'); // Redirect to admin dashboard if already logged in
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginAdmin(formData);
    if (result.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="https://via.placeholder.com/150x50?text=ShopyZone+Admin" alt="ShopyZone Admin Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700">Email or Phone Number</label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <Loader size={20} className="mr-2" colorClass="text-white" />
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an admin account? {''}
          <Link to="/admin/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
