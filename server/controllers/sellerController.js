import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/email.js";

// Seller Registration
export const registerSeller = async (req, res, next) => {
  try {
    const { name, email, phone, password, shopName, street, city, state, pincode } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password || !shopName || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for existing seller
    const existingSeller = await Seller.findOne({ email });

    // If seller exists but is not verified, update their info and send new OTP
    if (existingSeller && !existingSeller.isVerified) {
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Update seller with new OTP
      existingSeller.name = name;
      existingSeller.phone = phone;
      existingSeller.password = await bcrypt.hash(password, 10);
      existingSeller.shopName = shopName;
      existingSeller.businessAddress = { street, city, state, pincode };
      existingSeller.otp = otp;
      existingSeller.otpExpiresAt = otpExpiresAt;
      await existingSeller.save();

      try {
        // Send OTP email
        await sendOTPEmail(existingSeller.email, otp, "Your Seller Account Verification Code");
        return res.status(200).json({ message: "Account already exists. New OTP sent to your email." });
      } catch (emailError) {
        return res.status(200).json({
          message: "Account exists, not verified. Failed to send OTP email.",
          sellerId: existingSeller._id
        });
      }
    } else if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create seller
    const seller = await Seller.create({
      name,
      email,
      phone,
      password: hashedPassword,
      shopName,
      businessAddress: { street, city, state, pincode },
      otp,
      otpExpiresAt,
    });

    try {
      // Send OTP email
      await sendOTPEmail(email, otp, "Your Seller Account Verification Code");
      res.status(201).json({
        message: "Seller registered successfully. Please verify your email.",
        sellerId: seller._id,
      });
    } catch (emailError) {
      return res.status(201).json({
        message: "Seller registered successfully but failed to send OTP email.",
        sellerId: seller._id
      });
    }
  } catch (err) {
    next(err);
  }
};


// ---------------- LOGIN ----------------
export const loginSeller = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isEmail = /\S+@\S+\.\S+/.test(login);
    const query = isEmail ? { email: login } : { phone: login };
    const seller = await Seller.findOne(query);

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!seller.isVerified) {
      return res.status(403).json({ message: "Seller is not verified. Please verify your account." });
    }

    if(seller.isBlocked) {
      return res.status(403).json({ message: "Sorry, your account is blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(seller._id, seller);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        shopName: seller.shopName,
        role: seller.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ---------------- VERIFY OTP ----------------
export const verifySellerOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    if (seller.otp !== otp || seller.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    seller.isVerified = true;
    seller.otp = undefined;
    seller.otpExpiresAt = undefined;
    await seller.save();

    return res.json({ message: "Account verified successfully" });
  } catch (err) {
    next(err);
  }
};

// -----------Resent OTP------------
export const resendSellerOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const seller = await Seller.findOne({ email });

        if (!seller) {
            return res.status(400).json({ message: "Seller not found" });
        }

        if (seller.isVerified) {
            return res.status(400).json({ message: "Seller is already verified." });
        }

        // ---------Generate new OTP------------
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // Set an expiration time of 10 minutes

        seller.otp = otp;
        seller.otpExpiresAt = otpExpires;
        await seller.save();

        // -----------Send OTP via email-----------
        await sendOTPEmail(email, otp, "Your Seller Account Verification Code");

        res.json({ message: "New OTP sent to your email." });

    } catch (error) {
        next(error);
    }
};


// ---------------- LOGOUT ----------------
export const logoutSeller = (req, res) => {
  res.clearCookie("token",{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};



// ----------------Get User ----------------
export const getSeller = async (req, res, next) => {
  try {
    const user = await Seller.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
