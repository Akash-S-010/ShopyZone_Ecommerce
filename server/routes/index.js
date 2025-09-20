import express from 'express';
import userRoutes from './userRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import adminRoutes from './adminRoutes.js';
import addressRoutes from './addressRoutes.js';
import productRoutes from './productRoutes.js';
const router = express.Router();

// ---User routes----
router.use('/user',userRoutes);
router.use('/seller',sellerRoutes);
router.use('/admin',adminRoutes);
router.use('/address',addressRoutes);
router.use('/product',productRoutes);


export default router;