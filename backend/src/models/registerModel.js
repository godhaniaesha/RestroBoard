import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: { type: String },
    phone: { type: String },
    role: {
        type: String,
        enum: ["admin", "manager", "supplyer", "saif", "waiter"],
        default: "waiter"
    },
    password: { type: String },
    joining_Date: {
        type: String
    },
    address: {
        type: String
    },
    image: { type: String },
    otp: { type: Number },
    otpExpiry: { type: Date },
    isAdmin: {
        type: Boolean,
        default: false
    },
    leave_balance: {
        type: Number,
        default: 50
    },
}, { timestamps: true });

// Pre-save middleware to ensure isAdmin is in sync with role
registerSchema.pre('save', function (next) {
    this.isAdmin = this.role === 'admin';
    next();
});

//  JWT token create method
registerSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id,
        role: user.role || 'user',
        isAdmin: user.role === 'admin'
    }, process.env.JWT_SECRET, {
        expiresIn: "8h"  // Match the cookie expiration time
    });
    return token;
};

//  Password validation method
registerSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    return await bcrypt.compare(passwordInputByUser, user.password);
};

export default mongoose.model("register", registerSchema);
