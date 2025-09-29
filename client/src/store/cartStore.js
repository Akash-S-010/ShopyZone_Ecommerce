import { create } from "zustand";
import axios from "../config/axios.js";

const useCartStore = create((set, get) => ({
  cart: [],
  hasLoadedEmptyCart: false,

  addToCart: async (product, quantity) => {
    try {
      const response = await axios.post("/user/cart/add", { productId: product._id, quantity });
      set((state) => {
        const existingItemIndex = state.cart.findIndex((item) => item.product._id === product._id);
        if (existingItemIndex > -1) {
          const updatedCart = [...state.cart];
          updatedCart[existingItemIndex].quantity += quantity;
          return { cart: updatedCart, hasLoadedEmptyCart: false };
        } else {
          return { cart: [...state.cart, { product, quantity }], hasLoadedEmptyCart: false };
        }
      });
      get().getCart(); // Refresh cart after adding item
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },

  getCart: async () => {
     try {
       const response = await axios.get("/user/cart");
       console.log("Cart API Response:", response.data);
       set({ cart: response.data || [], hasLoadedEmptyCart: response.data?.length === 0 });
     } catch (error) {
       console.error("Error fetching cart:", error);
       set({ cart: [], hasLoadedEmptyCart: true });
     }
   },

  updateCartItemQuantity: async (productId, quantity) => {
     console.log("Updating cart item quantity:", { productId, quantity });
     try {
       const response = await axios.put(`/user/cart/update`, { productId, quantity });
       console.log("Update cart item response:", response.data);
       set((state) => ({
         cart: state.cart.map((item) =>
           item.product._id === productId ? { ...item, quantity } : item
         ),
       }));
       get().getCart(); // Refresh cart after updating quantity
     } catch (error) {
       console.error("Error updating cart item quantity:", error);
     }
   },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/user/cart/remove/${productId}`);
      set((state) => ({
        cart: state.cart.filter((item) => item.product._id !== productId),
      }));
      get().getCart(); // Refresh cart after removing item
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/user/cart/clear");
      set({ cart: [], hasLoadedEmptyCart: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },
}));

export default useCartStore;