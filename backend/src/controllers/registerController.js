import Register from "../models/registerModel.js";
import { ThrowError } from "../utils/ErrorUtils.js"
import bcrypt from "bcryptjs";
import fs from 'fs';
import path from "path";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendForbiddenResponse, sendCreatedResponse, sendUnauthorizedResponse } from '../utils/ResponseUtils.js';
import upload from "../middlewares/imageupload.js";

// Create a new register
export const createRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role, address } = req.body;

        // Check if user already exists by email or phone
        const existingUser = await Register.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: phone }
            ]
        });
        if (existingUser) {
            // If an image was uploaded, delete it asynchronously
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                try {
                    await fs.promises.unlink(filePath);
                } catch (err) {
                    console.error("Failed to delete unused image:", err);
                }
            }
            return res.status(400).json({ message: "Email or phone already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Set joining_Date to current date (e.g., as ISO string)
        const joining_Date = new Date().toISOString();

        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/public/images/${req.file.filename}`;
        }

        const user = await Register.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role,
            joining_Date,
            address,
            image: imagePath
        });

        res.status(201).json({ message: "User created", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single register by ID
export const getRegisterById = async (req, res) => {
    try {
        const { id } = req.params;

        let query = { _id: id };
        // Check if user exists and has proper role
        if (!req.user) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        // Check if user is admin or accessing their own profile
        const isAdmin = req.user.role === 'admin';
        if (!isAdmin && req.user._id.toString() !== id) {
            return sendForbiddenResponse(res, "Access denied. You can only view your own profile.");
        }

        const register = await Register.findOne(query);

        if (!register) {
            return sendErrorResponse(res, 404, "User not found");
        }

        return sendSuccessResponse(res, "User retrieved successfully", register);
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Update profile only user
export const updateProfileUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, address, joining_Date, role } = req.body;

        if (!req.user || (!req.user.isAdmin && req.user._id.toString() !== id)) {
            return sendForbiddenResponse(res, "Access denied. You can only update your own profile.");
        }

        const existingUser = await Register.findById(id);
        if (!existingUser) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            return sendErrorResponse(res, 404, "User not found");
        }

        // Handle image upload
        if (req.file) {
            // Convert the file path to a URL path
            const newImagePath = `/public/images/${path.basefirstName(req.file.path)}`;

            // Delete old image if exists
            if (existingUser.image) {
                const oldImagePath = path.join(process.cwd(), existingUser.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            existingUser.image = newImagePath;
        }

        // Update other fields
        if (firstName) {
            existingUser.firstName = firstName;
        }
        if (lastName) {
            existingUser.lastName = lastName;
        }
        if (email) {
            existingUser.email = email;
        }
        if (phone) {
            existingUser.phone = phone;
        }
        if (address) {
            existingUser.address = address;
        }
        if (joining_Date) {
            existingUser.joining_Date = joining_Date;
        }
        if (role) {
            existingUser.role = role;
            existingUser.isAdmin = role === 'admin';
        }

        await existingUser.save();

        // Return user data without password
        const userResponse = existingUser.toObject();
        delete userResponse.password;

        return sendSuccessResponse(res, "User updated successfully", userResponse);
    } catch (error) {
        if (req.file) {
            const filePath = path.resolve(req.file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return ThrowError(res, 500, error.message)
    }
};

// Delete register
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // First, find the Employee to get the image path before deleting the database record.
        const employeeToDelete = await Register.findById(id);

        if (!employeeToDelete) {
            return sendErrorResponse(res, 404, "Employee not found");
        }

        // Check if there is an image path stored.
        if (employeeToDelete.image) {
            // Construct the full, absolute path to the image file.
            const absoluteImagePath = path.join(process.cwd(), employeeToDelete.image);

            // Check if the file exists at that path and delete it.
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlinkSync(absoluteImagePath);
            }
        }

        // After handling the file, delete the Employee from the database.
        await Register.findByIdAndDelete(id);

        return sendSuccessResponse(res, "Employee deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get all Employee (admin only)
export const getAllEmployee = async (req, res) => {
    try {
        // Check if user is authenticated and is admin
        if (!req.user) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        if (!req.user.isAdmin) {
            return sendForbiddenResponse(res, "Access denied. Only admins can view all Employee.");
        }

        // Find all Employee with role 'waiter'
        const Employee = await Register.find({
            $or: [
                { role: "saif" },
                { role: "waiter" },
                { role: "manager" },
                { role: "supplier" },
            ]
        }).select('-password');

        // Check if any Employee were found
        if (!Employee || Employee.length === 0) {
            return sendSuccessResponse(res, "No Employee found", []);
        }

        // Send a success response with the fetched waiter
        return sendSuccessResponse(res, "Employee fetched successfully", Employee);

    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};


