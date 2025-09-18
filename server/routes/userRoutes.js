import express from 'express';
import { signupUser, loginUser, verifyOtp, forgotPassword, resetPassword, resendOTP, logoutUser} from '../controllers/userController.js';
import { refreshToken } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/register', signupUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

export default router;