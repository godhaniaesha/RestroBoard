import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';
import Supplier from "../models/supplierModel.js";
import { ThrowError } from "../utils/ErrorUtils.js";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendCreatedResponse, sendForbiddenResponse } from '../utils/ResponseUtils.js';

// Create a new supplier (admin only)
export const createSupplier = async (req, res) => {
    try {
        const { name, phone, whatsapp_number, email, address, ingredients_supplied, role } = req.body;

        if (!name || !phone) {
            return sendBadRequestResponse(res, "Name and phone are required");
        }

        const existingSupplier = await Supplier.findOne({ $or: [{ phone }, { email }] });
        if (existingSupplier) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                try {
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error("Failed to delete unused image:", err);
                }
            }
            return sendBadRequestResponse(res, "Phone number or email already registered for a supplier.");
        }

        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/public/supplyer_image/${req.file.filename}`;
        }

        const newSupplier = await Supplier.create({
            name,
            phone,
            whatsapp_number,
            email,
            address,
            ingredients_supplied,
            role,
            supplyer_image: imagePath
        });

        return sendCreatedResponse(res, "Supplier created successfully", newSupplier);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all getAllSuppliers (admin only)
export const getAllSuppliers = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return sendUnauthorizedResponse(res, "Authentication required");
        }

        // if (!req.user.isAdmin) {
        //     return sendForbiddenResponse(res, "Access denied. Only admins can view all waiters.");
        // }
        // Find all suppliers with role 'supplyer'
        const suppliers = await Supplier.find({ role: 'supplyer' }).select('-password');

        // Check if any suppliers were found
        if (!suppliers || suppliers.length === 0) {
            return sendSuccessResponse(res, "No suppliers found", []);
        }
          
        // Send a success response with the fetched suppliers
        return sendSuccessResponse(res, "Suppliers fetched successfully", suppliers)
        // Find all supplyers with role 'supplyer'
        // darshan code
        // const supplyers = await Supplier.find({ role: 'supplyer' }).select('-password');

        
        // if (!supplyers || supplyers.length === 0) {
            // return sendSuccessResponse(res, "No supplyer found", []);
        // }

        // Send a success response with the fetched supplyer
        // return sendSuccessResponse(res, "supplyer fetched successfully", supplyers)
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
};

// Get a single supplier by ID (admin only)
export const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return sendErrorResponse(res, 404, "Supplier not found");
        }

        return sendSuccessResponse(res, "Supplier fetched successfully", supplier);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update a supplier (admin only)
export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If ID is invalid and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid supplier ID format");
        }

        const supplier = await Supplier.findById(id);
        if (!supplier) {
            // If supplier not found and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return sendErrorResponse(res, 404, "Supplier not found");
        }

        // --- LOGIC TO REPLACE OLD IMAGE ---
        if (req.file) {
            const oldImagePath = supplier.supplyer_image; // Use the correct field name from your model

            if (oldImagePath) {
                const absoluteOldImagePath = path.join(process.cwd(), oldImagePath);
                if (fs.existsSync(absoluteOldImagePath)) {
                    fs.unlinkSync(absoluteOldImagePath);
                }
            }
            // Set the new image path for the database.
            supplier.supplyer_image = `/public/supplyer_image/${req.file.filename}`;
        }

        // --- UPDATE OTHER FIELDS ---
        const { name, phone, whatsapp_number, email, address, ingredients_supplied } = req.body;
        if (name) supplier.name = name;
        if (phone) supplier.phone = phone;
        if (whatsapp_number) supplier.whatsapp_number = whatsapp_number;
        if (email) supplier.email = email;
        if (address) supplier.address = address;
        if (ingredients_supplied) supplier.ingredients_supplied = ingredients_supplied;

        // Save all changes.
        await supplier.save();

        return sendSuccessResponse(res, "Supplier updated successfully", supplier);

    } catch (error) {
        // If any error occurs, clean up the newly uploaded file.
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return ThrowError(res, 500, error.message);
    }
};

// Delete a supplier (admin only)
export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If ID is invalid and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid Supplier ID format");
        }


        // First, find the supplier to get the image path before deleting the database record.
        const supplierToDelete = await Supplier.findById(id);

        if (!supplierToDelete) {
            return sendErrorResponse(res, 404, "Supplier not found");
        }

        // Check if there is an image path stored.
        if (supplierToDelete.supplyer_image) {
            // Construct the full, absolute path to the image file.
            const absoluteImagePath = path.join(process.cwd(), supplierToDelete.supplyer_image);

            // Check if the file exists at that path and delete it.
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlinkSync(absoluteImagePath);
            }
        }

        // After handling the file, delete the supplier from the database.
        await Supplier.findByIdAndDelete(id);

        return sendSuccessResponse(res, "Supplier deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}; 