import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';
import { checkSeller } from '../middlewares/sellerMiddleware.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
import { checkSellerOrAdmin } from '../middlewares/sellerOrAdminMiddleware.js';

const router = express.Router();

// Seller-specific routes
router.post('/', checkSeller, createProduct);
router.put('/:id', checkSeller, updateProduct);
router.delete('/:id', checkSellerOrAdmin, deleteProduct);

// Public routes (or user-accessible routes)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Review routes
router.post('/:productId/reviews', checkAuth, addReview);
router.get('/:productId/reviews', getReviews);
router.delete('/:productId/reviews/:reviewId', checkAuth, deleteReview);

export default router;