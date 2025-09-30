import { useState, useEffect, useCallback } from 'react';
import axios from '../../config/axios.js';
import ProductCard from '../../components/user/ProductCard';
import HeroSlider from '../../components/user/HeroSlider';
import Loader from '../../components/shared/Loader';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/product/all`); // Correctly destructure `data`
      setProducts(Array.isArray(data) ? data : data.products || []); // Handle the response properly
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <Loader className="min-h-screen" />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <HeroSlider />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Featured Products</h1>
      {
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      }

      {/* App Download Section */}
      <section
        className="relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-16 px-4 rounded-lg mt-12 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for readability */}
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Shop Smarter with Our App</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Download the ShopyZone app for exclusive deals, faster checkout, and a personalized shopping experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#" className="inline-block transition-transform transform hover:scale-105">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-14 sm:h-16" />
            </a>
            <a href="#" className="inline-block transition-transform transform hover:scale-105">
              <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play" className="h-14 sm:h-16" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


