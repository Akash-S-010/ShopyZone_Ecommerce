import express from "express";
import { adminLogin, getAllUsers, getAllSellers, toggleUserBlock, updateSellerStatus } from "../controllers/adminController.js";
import {checkAdmin} from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);
// Get all users
router.get("/users",checkAdmin, getAllUsers);
// user Block toggle
router.patch("/user/:id/toggle-block", checkAdmin, toggleUserBlock)
// Get all sellers
router.get("/sellers", checkAdmin, getAllSellers);
// Update seller status
router.patch("/seller/:id/update-status", checkAdmin, updateSellerStatus);


export default router;