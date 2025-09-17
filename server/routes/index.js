import express from 'express';
import userRoutes from './userRoutes.js';
const router = express.Router();

// ---User routes----
router.use('/user',userRoutes);

export default router;