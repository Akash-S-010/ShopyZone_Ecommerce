import express from 'express';
import userRoutes from './userRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import adminRoutes from './adminRoutes.js';
import addressRoutes from './addressRoutes.js';
const router = express.Router();

// ---User routes----
router.use('/user',userRoutes);
router.use('/seller',sellerRoutes);
router.use('/admin',adminRoutes);
router.use('/address',addressRoutes);

export default router;