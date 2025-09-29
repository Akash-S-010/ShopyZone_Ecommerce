import express from 'express';
import { signupUser, loginUser, verifyOtp, forgotPassword, resetPassword, resendOTP, logoutUser, getUser } from '../controllers/userController.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
import cartRoutes from './cartRoutes.js';
const router = express.Router();


router.post('/register', signupUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);
router.get('/get-user',checkAuth, getUser);

// Wishlist routes
router.post('/wishlist/add', checkAuth, addToWishlist);
router.delete('/wishlist/remove/:productId', checkAuth, removeFromWishlist);
router.get('/wishlist', checkAuth, getWishlist);

// Cart routes
router.use('/cart', cartRoutes);

export default router;