import User from "../models/User.js";
import Product from "../models/Product.js";

// Add item to cart
export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId || quantity < 1) {
            return res.status(400).json({ message: "Product ID and valid quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await User.findById(userId);

        // Check if item already in cart
        const existingItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        return res.status(200).json({
            message: "Item added to cart",
            cart: user.cart,
        });
    } catch (error) {
        next(error);
    }
};

// Get user cart
export const getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("cart.product", "name price discountPrice images stock");

        return res.status(200).json(user.cart);
    } catch (error) {
        next(error);
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || quantity < 1) {
            return res.status(400).json({ message: "Product ID and valid quantity required" });
        }

        const user = await User.findById(req.user._id);
        const cartItem = user.cart.find((item) => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cartItem.quantity = quantity;
        await user.save();

        return res.status(200).json({
            message: "Cart item updated",
            cart: user.cart,
        });
    } catch (error) {
        next(error);
    }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter((item) => item.product.toString() !== productId);

        await user.save();

        return res.status(200).json({
            message: "Item removed from cart",
            cart: user.cart,
        });
    } catch (error) {
        next(error);
    }
};

// Clear cart
export const clearCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        return res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        next(error);
    }
};
