import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

export const checkSeller = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const seller = await Seller.findById(decoded.id).select("-password");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.role !== "seller") {
      return res.status(403).json({ message: "Not authorized as a seller" });
    }

    req.seller = seller;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
