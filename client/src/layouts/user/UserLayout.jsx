import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const UserLayout = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">ShopyZone</Link>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li><span className="font-semibold">Welcome, {user.name}</span></li>
                <li><button onClick={handleLogout} className="hover:underline">Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:underline">Login</Link></li>
                <li><Link to="/register" className="hover:underline">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 ShopyZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserLayout;