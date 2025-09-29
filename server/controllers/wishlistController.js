import User from '../models/User.js';
import Product from '../models/Product.js';

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Add to wishlist if not already added
    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    // Return updated wishlist
    const populatedUser = await User.findById(req.user._id).populate('wishlist');
    
    return res.status(200).json({ 
      message: 'Product added to wishlist',
      wishlist: populatedUser.wishlist
    });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Remove from wishlist
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product not in wishlist' });
    }
    
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    // Return updated wishlist
    const populatedUser = await User.findById(req.user._id).populate('wishlist');
    
    return res.status(200).json({ 
      message: 'Product removed from wishlist',
      wishlist: populatedUser.wishlist
    });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    return res.status(200).json({ 
      wishlist: user.wishlist 
    });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};