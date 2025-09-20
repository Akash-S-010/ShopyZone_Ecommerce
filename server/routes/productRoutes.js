import express from "express";
import { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts, getSellerProducts} from "../controllers/productController.js";
import { addReview, getReviews, deleteReview } from "../controllers/reviewController.js";
import { checkSellerOrAdmin } from "../middlewares/sellerOrAdminMiddleware.js";
import { checkSeller } from "../middlewares/sellerMiddleware.js";
import { checkAuth } from "../middlewares/userMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Seller/Admin routes
router.post("/", checkSeller, createProduct);
router.put("/:id", checkSeller, updateProduct);
router.delete("/:id", checkSellerOrAdmin, deleteProduct);

// Seller-only routes
router.get("/seller/my-products", checkSeller, getSellerProducts);



// Review routes
router.post("/:productId/reviews", checkAuth, addReview);
router.get("/:productId/reviews", getReviews);
router.delete("/:productId/reviews/:reviewId", checkAuth, deleteReview);

export default router;
