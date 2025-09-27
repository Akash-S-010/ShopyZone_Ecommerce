import express from 'express';
import { adminRegister } from '../controllers/adminAuthController.js';

const router = express.Router();

router.post('/register', adminRegister);

export default router;