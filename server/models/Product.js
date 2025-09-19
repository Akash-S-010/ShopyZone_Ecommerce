import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    images: [{ type: String, required: true }],

    // Categories stored as strings (no extra model needed)
    category: { type: String, required: true },   // e.g. "Fashion"
    subCategory: { type: String },                // e.g. "Men > Shoes"

    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, default: 0 },

    variants: [
      {
        size: { type: String },     // fashion
        color: { type: String },    // fashion
        ram: { type: String },      // electronics
        storage: { type: String },  // electronics
        quantity: { type: Number, default: 0 },
      },
    ],

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    averageRating: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "draft", "out-of-stock"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
