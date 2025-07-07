import mongoose from "mongoose";
import path from 'path';
import fs from 'fs';
import Dish from "../models/dishModel.js"
import { ThrowError } from "../utils/ErrorUtils.js";
import {
    sendSuccessResponse,
    sendErrorResponse,
    sendBadRequestResponse,
    sendCreatedResponse
} from '../utils/ResponseUtils.js';
import Category from "../models/categoryModel.js";

// Create a new Dish (admin only)
export const createDish = async (req, res) => {
    try {
        const { dish_name, category_id, price, badge_Tag, description, rating } = req.body;

        if (!dish_name || !category_id || !price || !badge_Tag || !description || !rating) {
            return sendBadRequestResponse(res, "All Field are required");
        }

        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid category_id format");
        }

        const existingDish = await Dish.findOne({ dish_name });
        if (existingDish) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                try {
                    await fs.promises.unlink(filePath);
                } catch (err) {
                    console.error("Failed to delete unused image:", err);
                }
            }
            return sendBadRequestResponse(res, `${dish_name} already exists`);
        }

        // Check if category_id exists
        const categoryExists = await Category.findById(category_id);
        if (!categoryExists) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                try {
                    await fs.promises.unlink(filePath);
                } catch (err) {
                    console.error("Failed to delete unused image:", err);
                }
            }
            return sendBadRequestResponse(res, "category_id not found");
        }

        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/public/dish_image/${req.file.filename}`;
        }

        const newDish = await Dish.create({
            dish_name,
            category_id,
            price,
            badge_Tag,
            description,
            rating,
            dish_image: imagePath
        });

        return sendCreatedResponse(res, "Dish created successfully", newDish);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all Dish
export const getAllDish = async (req, res) => {
    try {
        const dish = await Dish.find({});

        // Check if any Dish were found
        if (!dish || dish.length === 0) {
            return sendSuccessResponse(res, "No Dish found", []);
        }

        return sendSuccessResponse(res, "Dish fetched successfully", dish);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get a single Dish by ID
export const getDishById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid Dish ID format");
        }

        const dish = await Dish.findById(id);
        if (!dish) {
            return sendErrorResponse(res, 404, "Dish not found");
        }

        return sendSuccessResponse(res, "Dish fetched successfully", dish);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update a dish (admin only)
export const updateDish = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If ID is invalid and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {

                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid Dish ID format");
        }

        const dish = await Dish.findById(id);
        if (!dish) {
            // If dish not found and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return sendErrorResponse(res, 404, "Dish not found");
        }

        // --- LOGIC TO REPLACE OLD IMAGE ---
        if (req.file) {
            const oldImagePath = dish.dish_image; // Use the correct field name from your model

            if (oldImagePath) {
                const absoluteOldImagePath = path.join(process.cwd(), oldImagePath);
                if (fs.existsSync(absoluteOldImagePath)) {
                    fs.unlinkSync(absoluteOldImagePath);
                }
            }
            // Set the new image path for the database.
            dish.dish_image = `/public/dish_image/${req.file.filename}`;
        }

        // --- UPDATE OTHER FIELDS ---
        const { dish_name, category_id, price, badge_Tag, description ,rating} = req.body;
        if (category_id) {
            if (!mongoose.Types.ObjectId.isValid(category_id)) {
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return sendBadRequestResponse(res, "Invalid category_id format");
            }
            dish.category_id = category_id;
        }
        if (dish_name) dish.dish_name = dish_name;
        if (price) dish.price = price;
        if (badge_Tag) dish.badge_Tag = badge_Tag;
        if (description) dish.description = description;
        if (rating) dish.rating = rating;

        // Save all changes.
        await dish.save();

        return sendSuccessResponse(res, "Dish updated successfully", dish);

    } catch (error) {
        // If any error occurs, clean up the newly uploaded file.
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return ThrowError(res, 500, error.message);
    }
};

// Delete a dish (admin only)
export const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            // If ID is invalid and a file was uploaded, delete it.
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return sendBadRequestResponse(res, "Invalid Dish ID format");
        }

        // First, find the Dish to get the image path before deleting the database record.
        const dishToDelete = await Dish.findById(id);

        if (!dishToDelete) {
            return sendErrorResponse(res, 404, "Dish not found");
        }

        // Check if there is an image path stored.
        if (dishToDelete.dish_image) {
            // Construct the full, absolute path to the image file.
            const absoluteImagePath = path.join(process.cwd(), dishToDelete.dish_image);

            // Check if the file exists at that path and delete it.
            if (fs.existsSync(absoluteImagePath)) {
                fs.unlinkSync(absoluteImagePath);
            }
        }

        // After handling the file, delete the Dish from the database.
        await Dish.findByIdAndDelete(id);

        return sendSuccessResponse(res, "Dish deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}; 