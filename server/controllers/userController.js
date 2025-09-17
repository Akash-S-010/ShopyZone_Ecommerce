import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "../utils/token.js";
import {generateOTP} from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";


// ---------------- SIGNUP ----------------
export const signupUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    await sendEmail(
      user.email,
      "Verify your account",
      `Your OTP is ${otp}`,
      `<h1>Your OTP is ${otp}</h1>`
    );

    res.status(201).json({ message: "Signup successful. Please verify OTP." });
  } catch (err) {
    next(err);
  }
};



// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    next(err);
  }
};



// ---------------- LOGIN ----------------
export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // email OR phone

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your account" });

    const token = generateToken(user._id, "user");
    const refreshToken = generateRefreshToken(user._id, "user");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};



// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your password reset OTP is ${otp}`,
      `<h1>Your password reset OTP is ${otp}</h1>`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};



// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
