import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  // Basic Account Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "seller" },
  isVerified: { type: Boolean, default: false },

  // Store Info (basic)
  shopName: { type: String, required: true },
  businessAddress: { type: String, required: true },
  storeDescription: { type: String },

  // Status & Verification
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // OTP for email
  otp: String,
  otpExpiresAt: Date,
}, { timestamps: true });

export default mongoose.model("Seller", sellerSchema);
