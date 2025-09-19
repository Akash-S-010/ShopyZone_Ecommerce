import express from 'express';
import userRoutes from './userRoutes.js';
import sellerRoutes from './sellerRoutes.js';
const router = express.Router();

// ---User routes----
router.use('/user',userRoutes);
router.use('/seller',sellerRoutes);

export default router;