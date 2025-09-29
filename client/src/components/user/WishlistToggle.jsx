import { Heart } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import { toast } from 'react-hot-toast';

const WishlistToggle = ({ productId, className = '' }) => {
  const { user, addToWishlist, removeFromWishlist, isAuthenticated } = useAuthStore();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use useCallback to memoize the function
  const checkWishlistStatus = useCallback(() => {
    if (user && user.wishlist) {
      setIsInWishlist(user.wishlist.some(item => item._id === productId || item === productId));
    }
  }, [user, productId]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your wishlist');
      return;
    }

    setIsProcessing(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(productId);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isProcessing}
      className={`p-2 rounded-full transition-colors ${
        isInWishlist 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className} ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>
  );
};

export default WishlistToggle;