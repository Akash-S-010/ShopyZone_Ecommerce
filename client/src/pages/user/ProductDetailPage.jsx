import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../config/axios";
import Loader from "../../components/shared/Loader";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import WishlistToggle from "../../components/user/WishlistToggle";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post("/user/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      toast.success("Added to cart");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    }
  };

  if (loading) return <Loader className="min-h-screen" />;
  if (error) return <div className="text-center text-red-600 p-8">{error}</div>;
  if (!product) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/800x600?text=No+Image"
            }
            alt={product.name}
            className="w-full h-auto rounded-md"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-gray-700">{product.description}</p>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-indigo-600">
              ₹{Number(product.discountPrice).toFixed(2)}
            </span>
            {product.discountPrice && (
              <span className="ml-3 line-through text-gray-400">
                ₹{Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleAddToCart}
              className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              <ShoppingCart size={18} className="mr-2" /> Add to Cart
            </button>
            <WishlistToggle productId={product._id} className="p-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;


