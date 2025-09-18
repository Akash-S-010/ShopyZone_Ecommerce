import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String },

  // Shop info
  shopName: { type: String, required: true },
  shopDescription: { type: String },
  shopLogo: { type: String },

  // Admin approval + verification
  isApproved: { type: Boolean, default: false },  // admin approval
  isVerified: { type: Boolean, default: false },  // KYC/documents verified

  documents: [
    {
      docType: String,   // e.g. GST, PAN, License
      docUrl: String,    // Cloud/S3 file link
      verified: { type: Boolean, default: false }
    }
  ],

  // Product relation
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // Revenue tracking
  totalRevenue: { type: Number, default: 0 },     // lifetime revenue
  pendingBalance: { type: Number, default: 0 },   // waiting payout
  payouts: [
    {
      amount: Number,
      status: { type: String, enum: ["pending", "completed"], default: "pending" },
      requestedAt: { type: Date, default: Date.now },
      paidAt: Date
    }
  ],
  role: {
    type: String,
    enum: ["user", "admin", "seller"],
    default: "seller",
  },
}, { timestamps: true });

export default mongoose.model("Seller", sellerSchema);
