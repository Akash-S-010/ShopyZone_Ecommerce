import express from 'express';
import { signupUser, loginUser, verifyOtp, forgotPassword, resetPassword} from '../controllers/userController.js';
const router = express.Router();


router.post('/register', signupUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;