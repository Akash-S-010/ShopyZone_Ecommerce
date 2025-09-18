import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "../utils/token.js";
import {generateOTP} from "../utils/otp.js";
import { sendOTPEmail } from "../utils/email.js";


// ---------------- SIGNUP ----------------
export const signupUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({email});
    
    // If user exists but is not verified, update their info and send new OTP
    if (existingUser && !existingUser.isVerified) {
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      // Update user with new OTP
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.otp = otp;
      existingUser.otpExpiresAt = otpExpiresAt;
      await existingUser.save();
      
      try {
        // Send OTP email
        await sendOTPEmail(existingUser.email, otp, "Your ShopyZone verification code");
        return res.status(200).json({ message: "Account already exists. New OTP sent to your email." });
      } catch (emailError) {
        return res.status(200).json({ 
          message: "Account exists, not verified. Failed to send OTP email. Please use forgot password to get a new OTP.",
          userId: existingUser._id
        });
      }
    } else if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password for new user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiresAt,
    });

    try {
      // Send OTP email
      await sendOTPEmail(user.email, otp, "Your ShopyZone verification code");
      return res.status(201).json({ message: "Signup successful. Please verify OTP sent to your email." });
    } catch (emailError) {
      return res.status(201).json({ 
        message: "Signup successful but failed to send OTP email. Please use forgot password to get a new OTP.",
        userId: user._id
      });
    }
  } catch (err) {
    next(err);
  }
};



// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Account verified successfully" });
  } catch (err) {
    next(err);
  }
};


// -----------Resent OTP------------
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User is already verified." });
        }

        // ---------Generate new OTP------------
        const otp = generateOTP();
        const otpExpires = Date.now() + 4 * 60 * 1000; // Set an expiration time of 4 minutes

        user.otp = otp;
        user.otpExpiresAt = otpExpires;
        await user.save();

        // -----------Send OTP via email-----------
        await sendOTPEmail(email, otp, "Your ShopyZone verification code");

        res.json({ message: "New OTP sent to your email." });

    } catch (error) {
        next(error);
    }
};


// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isEmail = /\S+@\S+\.\S+/.test(login);
    const query = isEmail ? { email: login } : { phone: login };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user);
    const refreshToken = generateRefreshToken(user._id, user);

    res.cookie("refreshToken", refreshToken, {
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
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ---------------- FORGOT PASSWORD ----------------
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      // Use the dedicated OTP email function for consistent styling
      await sendOTPEmail(user.email, otp, "Your ShopyZone password reset code");
      return res.json({ message: "OTP sent to your email" });
    } catch (emailError) {
      // Revert the OTP changes since email failed
      user.otp = undefined;
      user.otpExpiresAt = undefined;
      await user.save();
      
      return res.status(500).json({ message: "Failed to send OTP email. Please try again later." });
    }
  } catch (err) {
    next(err);
  }
};



// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
