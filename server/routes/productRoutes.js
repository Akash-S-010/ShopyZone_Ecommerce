import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';
import { checkSeller } from '../middlewares/sellerMiddleware.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
import { checkSellerOrAdmin } from '../middlewares/sellerOrAdminMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Seller-specific routes
router.post('/create', checkSeller, upload.array('images', 10), createProduct);
router.put('/:id', checkSeller, upload.array('images', 10), updateProduct);
router.delete('/:id', checkSellerOrAdmin, deleteProduct);

// Public routes (or user-accessible routes)
router.get('/all', getAllProducts);
router.get('/:id', getProductById);

// Review routes
router.post('/:productId/reviews', checkAuth, addReview);
router.get('/:productId/reviews', getReviews);
router.delete('/:productId/reviews/:reviewId', checkAuth, deleteReview);

export default router;