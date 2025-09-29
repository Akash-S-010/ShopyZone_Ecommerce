import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../../config/axios';

const WishlistItem = ({ product, onRemove }) => {
  const handleAddToCart = async () => {
    try {
      await axios.post('/user/cart/add', { productId: product._id, quantity: 1 });
      toast.success('Added to cart');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <Link to={`/product/${product._id}`} className="flex-shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
        <div className="flex items-center mb-3 mt-auto">
          <span className="font-bold text-lg">₹{product.discountPrice || product.price}</span>
          {product.discountPrice && (
            <span className="text-gray-500 line-through text-sm ml-2">₹{product.price}</span>
          )}
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </button>
          <button
            onClick={() => onRemove(product._id)}
            className="bg-red-100 text-red-600 p-2 rounded-md hover:bg-red-200 transition-colors"
            aria-label="Remove from wishlist"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;