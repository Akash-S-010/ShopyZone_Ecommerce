import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    phone: {
        type: String
    },

    // Platform revenue tracking
    platformEarnings: {
        type: Number,
        default: 0
    },

    totalSalesVolume: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
