import express from 'express';
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, updateOrderItemStatus, createRazorpayOrder, handleRazorpayWebhook, verifyRazorpayPayment } from '../controllers/orderController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
import { checkAdmin } from '../middlewares/adminMiddleware.js';
import { checkSeller } from '../middlewares/sellerMiddleware.js';

const router = express.Router();

// User routes
router.post('/', checkAuth, placeOrder);
router.post('/create-razorpay-order', checkAuth, createRazorpayOrder);
router.post('/razorpay/verify-payment', checkAuth, verifyRazorpayPayment);
router.get('/my-orders', checkAuth, getUserOrders);

// Razorpay Webhook (no authentication needed)
// router.post('/webhook', handleRazorpayWebhook);

// Admin routes
router.get('/', checkAdmin, getAllOrders);
router.put('/status', checkAdmin, updateOrderStatus);

// Seller routes
router.put('/item-status', checkSeller, updateOrderItemStatus);

export default router;