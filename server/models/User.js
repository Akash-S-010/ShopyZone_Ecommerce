import mongoose from "mongoose";

// Address sub-schema
const addressSchema = new mongoose.Schema({
    Address: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
}, { _id: true });

// Main User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
    },

    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
        unique: true,
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },

    role: {
        type: String,
        default: "user",
    },

    addresses: [addressSchema], //  Multiple addresses

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],

    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    otp: String,
    otpExpiresAt: Date,

    googleId: { type: String, sparse: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },

}, { timestamps: true });


export default mongoose.model("User", userSchema);
