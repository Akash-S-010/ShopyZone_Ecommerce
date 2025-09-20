import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";
import Admin from "../models/Admin.js";

export const checkSellerOrAdmin = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Try fetching seller
    const seller = await Seller.findById(decoded.id).select("-password");
    if (seller && seller.role === "seller") {
      req.seller = seller;
      return next();
    }

    // Try fetching admin
    const admin = await Admin.findById(decoded.id).select("-password");
    if (admin && admin.role === "admin") {
      req.admin = admin;
      return next();
    }

    // If neither seller nor admin
    return res.status(403).json({ message: "Access denied. Only seller or admin allowed." });
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
