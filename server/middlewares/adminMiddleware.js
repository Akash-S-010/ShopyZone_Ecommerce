import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const checkAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(404).json({ message: "admin not found" });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({ message: "Not authorized as a admin" });
        }

        req.admin = admin;
        next();
    } catch (err) {
        console.error("Auth Error:", err.message);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};