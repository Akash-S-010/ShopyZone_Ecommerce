import express from 'express';
import { registerSeller, loginSeller, verifySellerOTP, resendSellerOTP, logoutSeller, getSeller } from '../controllers/sellerController.js';
import { get } from 'mongoose';
const router = express.Router();

router.post('/signup',registerSeller);
router.post('/login',loginSeller);
router.post('/verify-otp',verifySellerOTP);
router.post('/resend-otp',resendSellerOTP);
router.post('/logout',logoutSeller);
router.get('/seller', getSeller);


export default router;