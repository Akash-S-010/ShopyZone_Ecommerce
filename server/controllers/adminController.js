import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";


export const adminLogin = async (req, res, next) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isEmail = /\S+@\S+\.\S+/.test(login);
        const query = isEmail ? { email: login } : { phone: login };
        const user = await Admin.findOne(query);

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (error) {
        next(error);
    }
};



// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password -otp -otpExpiry");
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


// ---------------- GET ALL SELLERS ----------------
export const getAllSellers = async (req, res, next) => {
    try {
        const sellers = await Seller.find().select("-password -otp -otpExpiry");
        res.status(200).json(sellers);
    } catch (error) {
        next(error);
    }
};


// ----------------  USER Block TOGGLE ----------------
export const toggleUserBlock = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully` });
    } catch (error) {
        next(error);
    }
};

// ---------------- UPDATE SELLER STATUS ----------------
export const updateSellerStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status provided. Must be 'approved' or 'rejected'." });
        }

        const seller = await Seller.findById(id);

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        seller.status = status;
        await seller.save();

        res.status(200).json({ message: `Seller status updated to ${status} successfully` });
    } catch (error) {
        next(error);
    }
};