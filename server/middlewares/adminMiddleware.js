import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const checkAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select('-password');

        if (!req.admin || req.admin.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized as a admin" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};