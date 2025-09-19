import express from 'express';
import { registerSeller, loginSeller, verifySellerOTP, resendSellerOTP, logoutSeller } from '../controllers/sellerController.js';
const router = express.Router();

router.post('/signup-seller',registerSeller);
router.post('/login-seller',loginSeller);
router.post('/verify-seller-otp',verifySellerOTP);
router.post('/resend-seller-otp',resendSellerOTP);
router.post('/logout-seller',logoutSeller);


export default router;