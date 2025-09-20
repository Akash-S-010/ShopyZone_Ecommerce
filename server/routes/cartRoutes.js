import express from "express";
import { addToCart, getCart,  removeFromCart, clearCart, updateCartItem} from "../controllers/cartController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require user authentication
router.use(checkAuth);

// Add item to cart
router.post("/add", addToCart);

// Get user cart
router.get("/", getCart);

// Update quantity of a cart item
router.put("/update", updateCartItem);

// Remove an item from cart
router.delete("/remove/:productId", removeFromCart);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
