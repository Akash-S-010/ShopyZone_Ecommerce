import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
      const { data } = await axios.get(`/api/product/all`);
      setProducts(Array.isArray(data) ? data : data.products || []);
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
      <section className="bg-indigo-700 text-white py-16 px-4 rounded-lg mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Shop Smarter with Our App</h2>
          <p className="text-xl mb-8">
            Download the ShopyZone app for exclusive deals, faster checkout, and a personalized shopping experience.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="inline-block">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-14" />
            </a>
            <a href="#" className="inline-block">
              <img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play" className="h-14" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


