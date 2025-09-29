import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import WishlistToggle from './WishlistToggle';
import useCartStore from '../../store/cartStore'; // Changed from useAuthStore

const ProductCard = ({ product, onAddedToCart }) => {
  const { addToCart } = useCartStore(); // Changed from useAuthStore

  const handleAddToCart = async () => {
    try {
      await addToCart(product, 1);
      toast.success('Product added to cart');
      if (onAddedToCart) onAddedToCart();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
        </Link>
        <div className="mt-2">
          {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price ? (
            <>
              <span className="text-xl font-bold text-indigo-600">₹{Number(product.discountPrice).toFixed(2)}</span>
              <span className="ml-2 line-through text-gray-400">₹{Number(product.price).toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-indigo-600">₹{Number(product.price).toFixed(2)}</span>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            <ShoppingCart size={18} className="mr-2" /> Add to Cart
          </button>
          <WishlistToggle 
            productId={product._id} 
            className="inline-flex items-center justify-center px-3 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


