import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSellerAuthStore from '../../store/sellerAuthStore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
// import logo from '../../assets/logo.png';

const SellerOtpVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { verifySellerOtp, resendSellerOtp, isLoading } = useSellerAuthStore();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const result = await verifySellerOtp({ email, otp });
    if (result.success) {
      navigate('/seller/login');
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email to resend OTP.');
      return;
    }
    await resendSellerOtp(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="" alt="ShopyZone Seller Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Your Seller Account</h2>
        <p className="text-center text-gray-600 mb-4">A 6-digit OTP has been sent to your email. Please enter it below.</p>
        
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
              maxLength="6"
              pattern="[0-9]{6}"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Didn't receive the OTP? {''}
          <button
            onClick={handleResendOtp}
            disabled={isLoading}
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
          >
            Resend OTP
          </button>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Back to {''}
          <Link to="/seller/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SellerOtpVerificationPage;

