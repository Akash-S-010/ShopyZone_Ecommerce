import express from 'express';
import { signupUser, loginUser, verifyOtp, forgotPassword, resetPassword, resendOTP, logoutUser, getUser } from '../controllers/userController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/register', signupUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logoutUser);
router.get('/get-user',checkAuth, getUser);

export default router;