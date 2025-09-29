import React, { useEffect } from "react";
import useCartStore from "../../store/cartStore.js";
import { Minus, Plus, Trash2 } from "lucide-react";
import Button from '../../components/ui/Button'
import { Link, useNavigate } from "react-router-dom";


const Cart = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.cart);
  const getCart = useCartStore((s) => s.getCart);
  const updateCartItemQuantity = useCartStore((s) => s.updateCartItemQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const clearCart = useCartStore((s) => s.clearCart);
  // derive subtotal locally so the UI updates immediately when `items` change
  const subtotal = items.reduce((sum, it) => sum + (it.product?.discountPrice || it.product?.price || 0) * (it.quantity || 0), 0);
  const deliveryFee = 20; // default delivery fee
  const total = subtotal + deliveryFee;


  useEffect(() => {
    getCart();
  }, []);


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold text-off-white">Your Cart</h1>
        {items.length === 0 ? (
          <div className="rounded-xl border border-surface bg-card p-6">
            <p className="text-muted">
              Your cart is empty.{" "}
              <Link className="text-primary" to="/menu">
                Browse menu
              </Link>
            </p>
          </div>
        ) : (
          items.map((it) => (
            <div
              key={it.product?._id || it.product}
              className="rounded-xl border border-surface bg-card p-4 flex gap-4 items-center"
            >
              <img
                src={it.product?.images[0]}
                alt={it.product?.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-off-white">
                  {it.product?.name}
                </h3>
                <p className="text-muted">
                  {it.product?.discountPrice && it.product.discountPrice > 0 ? (
                    <>
                      <span className="text-xl font-bold text-indigo-600">₹{Number(it.product.discountPrice).toFixed(2)}</span>
                      <span className="ml-2 line-through text-gray-400">₹{Number(it.product.price).toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-indigo-600">₹{Number(it.product?.price).toFixed(2)}</span>
                  )}
                </p>
                <div className="mt-2 inline-flex items-center gap-3 rounded-md border border-surface px-3 py-2">
                  <button
                    onClick={() =>
                      updateCartItemQuantity(
                        it.product?._id || it.product,
                        Math.max(1, it.quantity - 1)
                      )
                    }
                    className="p-1 hover:text-primary bg-transparent cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center font-semibold text-off-white">
                    {it.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItemQuantity(it.product?._id || it.product, it.quantity + 1)
                    }
                    className="p-1 hover:text-primary bg-transparent cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-off-white">
                  ₹{((it.product?.discountPrice || it.product?.price || 0) * it.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(it.product?._id || it.product)}
                  className="mt-2 inline-flex items-center gap-1 text-accent hover:opacity-90 bg-transparent cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-surface bg-card p-4">
          <h2 className="font-bold text-off-white mb-2">Summary</h2>
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Delivery</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-surface my-2" />
          <div className="flex justify-between font-bold text-off-white">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <Button
            disabled={items.length === 0}
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full px-4 py-3 rounded-md text-black font-semibold"
          >
            Proceed to Checkout
          </Button>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-2 w-full px-4 py-2 rounded-md border text-off-white border-surface hover:bg-surface cursor-pointer bg-transparent"
            >
              Clear Cart
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};


export default Cart;


