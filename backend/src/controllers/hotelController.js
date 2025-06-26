import mongoose from "mongoose";
import path from 'path';
import fs from 'fs';
import Hotel from "../models/hotelModel.js"
import { ThrowError } from "../utils/ErrorUtils.js";
import {
    sendSuccessResponse,
    sendErrorResponse,
    sendBadRequestResponse,
    sendCreatedResponse
} from '../utils/ResponseUtils.js';

// Create a new Hotel (admin only)
export const createHotel = async (req, res) => {
    try {
        const { hotel_name, phone, email, address, description, amenities, instagram, facebook, twitter } = req.body;

        if (!hotel_name || !phone || !email || !address || !description || !instagram || !facebook || !twitter) {
            return sendBadRequestResponse(res, "All Field are required");
        }

        const existingHotel = await Hotel.findOne({ $or: [{ hotel_name }, { email }] });
        if (existingHotel) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                try {
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error("Failed to delete unused image:", err);
                }
            }
            return sendBadRequestResponse(res, "hotel_name already registered for a Hotel.");
        }

        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/public/hotel_image/${req.file.filename}`;
        }

        const newHotel = await Hotel.create({
            hotel_name,
            phone,
            email,
            address,
            description,
            amenities,
            instagram,
            facebook,
            twitter,
            hotel_image: imagePath
        });

        return sendCreatedResponse(res, "Hotel created successfully", newHotel);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all Hotel
export const getAllHotel = async (req, res) => {
    try {
        const hotel = await Hotel.find({});

        // Check if any hotel were found
        if (!hotel || hotel.length === 0) {
            return sendSuccessResponse(res, "No hotel found", []);
        }

        return sendSuccessResponse(res, "hotel fetched successfully", hotel);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get a single hotel by ID
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid hotel ID format");
        }

        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return sendErrorResponse(res, 404, "Hotel not found");
        }

        return sendSuccessResponse(res, "Hotel fetched successfully", hotel);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update a hotel (admin only)
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If ID is invalid and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid Hotel ID format");
        }

        const hotel = await Hotel.findById(id);
        if (!hotel) {
            // If hotel not found and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return sendErrorResponse(res, 404, "Hotel not found");
        }

        // --- LOGIC TO REPLACE OLD IMAGE ---
        if (req.file) {
            const oldImagePath = hotel.hotel_image; // Use the correct field name from your model

            if (oldImagePath) {
                const absoluteOldImagePath = path.join(process.cwd(), oldImagePath);
                if (fs.existsSync(absoluteOldImagePath)) {
                    fs.unlinkSync(absoluteOldImagePath);
                }
            }
            // Set the new image path for the database.
            hotel.hotel_image = `/public/hotel_image/${req.file.filename}`;
        }

        // --- UPDATE OTHER FIELDS ---
        const { hotel_name, phone, email, address, description, amenities, instagram, facebook, twitter } = req.body;
        if (hotel_name) hotel.hotel_name = hotel_name;
        if (phone) hotel.phone = phone;
        if (email) hotel.email = email;
        if (address) hotel.address = address;
        if (description) hotel.description = description;
        if (amenities) hotel.amenities = amenities;
        if (instagram) hotel.instagram = instagram;
        if (facebook) hotel.facebook = facebook;
        if (twitter) hotel.twitter = twitter;

        // Save all changes.
        await hotel.save();

        return sendSuccessResponse(res, "hotel updated successfully", hotel);

    } catch (error) {
        // If any error occurs, clean up the newly uploaded file.
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return ThrowError(res, 500, error.message);
    }
};

// Delete a hotel (admin only)
export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If ID is invalid and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid Hotel ID format");
        }

        // First, find the Hotel to get the image path before deleting the database record.
        const hotelToDelete = await Hotel.findById(id);

        if (!hotelToDelete) {
            return sendErrorResponse(res, 404, "Hotel not found");
        }

        // Check if there is an image path stored.
        if (hotelToDelete.hotel_image) {
            // Construct the full, absolute path to the image file.
            const absoluteImagePath = path.join(process.cwd(), hotelToDelete.hotel_image);

            // Check if the file exists at that path and delete it.
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlinkSync(absoluteImagePath);
            }
        }

        // After handling the file, delete the hotel from the database.
        await Hotel.findByIdAndDelete(id);

        return sendSuccessResponse(res, "Hotel deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}; 