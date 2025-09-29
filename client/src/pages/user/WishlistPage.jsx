import { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import { HeartCrack } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import WishlistItem from '../../components/user/WishlistItem';

const WishlistPage = () => {
  const { getWishlist, removeFromWishlist, isLoading } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlist();
        if (response.success && response.wishlist) {
          setItems(response.wishlist);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      // First update local state to prevent UI lag
      setItems((prev) => prev.filter((p) => p._id !== productId));
      // Then make the API call
      await removeFromWishlist(productId);
      // No need to update state again as we've already updated it
    } catch (err) {
      // If there's an error, revert the local state change
      const message = err.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
      // Refresh the wishlist to ensure consistency
      if (hasRequestedWishlist.current) {
        const response = await getWishlist();
        if (response.success && response.wishlist) {
          setItems(response.wishlist);
        }
      }
    }
  };

  if (loading || isLoading) return <Loader className="min-h-screen" />;
  if (error) return <div className="text-center text-red-500 min-h-screen flex items-center justify-center">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Your Wishlist</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
          <HeartCrack className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-4">
            Items you add to your wishlist will appear here.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <WishlistItem 
              key={product._id} 
              product={product} 
              onRemove={handleRemove} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;


