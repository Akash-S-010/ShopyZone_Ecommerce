import express from 'express';
import { addAddress, getAddresses, updateAddress, deleteAddress } from '../controllers/addressController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', checkAuth, addAddress);
router.get('/', checkAuth, getAddresses);
router.put('/:addressId', checkAuth, updateAddress);
router.delete('/:addressId', checkAuth, deleteAddress);

export default router;