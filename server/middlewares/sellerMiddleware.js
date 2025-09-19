import jwt from 'jsonwebtoken';
import Seller from '../models/Seller.js';

export const checkSeller = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.seller = await Seller.findById(decoded.id).select('-password');

        if (!req.seller || req.seller.role !== 'seller') {
            return res.status(403).json({ message: "Not authorized as a seller" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};