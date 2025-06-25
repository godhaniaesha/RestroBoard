import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendUnauthorizedResponse } from '../utils/ResponseUtils.js';
import { twilioConfig } from "../config/twilioConfig.js"
import twilio from "twilio"; // npm install twilio

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendBadRequestResponse(res, "Email and password are required");
        }

        const user = await Register.findOne({ email: email.toLowerCase() });
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendUnauthorizedResponse(res, "Invalid password");
        }

        // Generate JWT token
        const token = await user.getJWT();
        if (!token) {
            return sendErrorResponse(res, 500, "Failed to generate token");
        }

        // Return user data with role and isAdmin status
        return sendSuccessResponse(res, "Login successful", {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            isAdmin: user.role === 'admin',
            token: token
        });
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

//forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return ThrowError(res, 400, "Phone number is required");
        }

        // Find user by phone
        const user = await Register.findOne({ phone });
        if (!user) {
            return ThrowError(res, 404, "User not found");
        }

        // Validate and format recipient's phone number
        let formattedPhone = phone.toString().replace(/\D/g, ''); // Remove all non-digits
        if (formattedPhone.length === 10) {
            formattedPhone = `+91${formattedPhone}`; // Add India country code
        } else if (formattedPhone.length === 12 && formattedPhone.startsWith('91')) {
            formattedPhone = `+${formattedPhone}`; // Add + if missing
        } else {
            return ThrowError(res, 400, "Invalid phone number format. Please provide a valid 10-digit Indian phone number.");
        }

        // Generate OTP
        const otp = generateOTP();

        // Save OTP and expiry to user
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
        await user.save();

        // Get Twilio credentials from environment variables
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromPhone = process.env.TWILIO_PHONE_NUMBER;  // This must be your Twilio number

        // Validate Twilio configuration
        if (!accountSid || !authToken || !fromPhone) {
            console.error("Missing Twilio configuration:", { accountSid, authToken, fromPhone });
            return ThrowError(res, 500, "Twilio configuration is incomplete");
        }

        // Initialize Twilio client
        const client = twilio(accountSid, authToken);

        try {
            // Send SMS using Twilio
            const message = await client.messages.create({
                body: `Your verification code is: ${otp}. Valid for 5 minutes.`,
                to: formattedPhone,
                from: fromPhone  // Using the Twilio phone number
            });

            console.log("SMS sent successfully:", {
                messageSid: message.sid,
                status: message.status,
                to: message.to,
                from: message.from
            });

            return res.status(200).json({
                msg: "OTP sent successfully to your phone",
                data: null
            });

        } catch (twilioError) {
            console.error("Twilio Error:", {
                code: twilioError.code,
                message: twilioError.message,
                details: twilioError
            });

            return ThrowError(res, 500, `SMS sending failed: ${twilioError.message}`);
        }

    } catch (error) {
        console.error("Send OTP error:", error);
        return ThrowError(res, 500, error.message);
    }
};

//Verify Email
export const VerifyPhone = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        console.log('Verifying OTP:', { phone, otp }); // Debug log

        if (!phone || !otp) {
            return sendBadRequestResponse(res, "Please provide phone and OTP.");
        }

        const user = await Register.findOne({ phone: phone });
        if (!user) {
            return sendErrorResponse(res, 404, "User not found.");
        }

        console.log('User OTP details:', {
            storedOTP: user.otp,
            providedOTP: otp,
            expiry: user.otpExpiry,
            currentTime: new Date()
        }); // Debug log

        // Check if OTP exists and is not expired
        if (!user.otp || !user.otpExpiry) {
            return sendBadRequestResponse(res, "No OTP found. Please request a new OTP.");
        }

        if (user.otp !== otp) {
            return sendBadRequestResponse(res, "Invalid OTP.");
        }

        if (user.otpExpiry < Date.now()) {
            return sendBadRequestResponse(res, "OTP has expired. Please request a new OTP.");
        }

        await user.save();

        return sendSuccessResponse(res, "OTP verified successfully.");

    } catch (error) {
        console.error('Verify Email Error:', error); // Debug log
        return ThrowError(res, 500, error.message);
    }
};

// Reset Password using OTP
export const resetPassword = async (req, res) => {
    try {
        const { phone, newPassword, confirmPassword } = req.body;
        if (!newPassword || !confirmPassword) {
            return sendBadRequestResponse(res, "Please provide phone, newpassword and confirmpassword.");
        }

        const user = await Register.findOne({ phone: phone });
        if (!user) {
            return sendErrorResponse(res, 400, "User Not Found");
        }

        if (!(newPassword === confirmPassword)) {
            return sendBadRequestResponse(res, "Please check newpassword and confirmpassword.");
        }

        await Register.findOne({ password: newPassword });
        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return sendSuccessResponse(res, "Password reset successfully.", { id: user._id, phone: user.phone });
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Change Password for user
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return sendBadRequestResponse(res, "oldPassword, newPassword, and confirmPassword are required.");
        }

        // Get user from the authenticated request
        const user = await Register.findById(req.user._id);
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return sendBadRequestResponse(res, "Current password is incorrect.");
        }

        if (newPassword === oldPassword) {
            return sendBadRequestResponse(res, "New password cannot be the same as current password.");
        }

        if (newPassword !== confirmPassword) {
            return sendBadRequestResponse(res, "New password and confirm password do not match.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return sendSuccessResponse(res, "Password changed successfully.");

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};

//logoutUser
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()) });
        return sendSuccessResponse(res, "User logout successfully...✅");
    } catch (error) {
        return sendErrorResponse(res, 400, error.message);
    }
};
