import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';
import Item from "../models/itemModel.js";
import Category  from "../models/categoryModel.js";
import { ThrowError } from "../utils/ErrorUtils.js";
import { sendSuccessResponse, sendErrorResponse, sendBadRequestResponse, sendCreatedResponse } from '../utils/ResponseUtils.js';

export const createItem = async (req, res) => {
    try {
        const { item_name, category_id, price, quantity, unit, minimum_threshold, expiry_date, supplier_id } = req.body;

        // Validate required fields
        if (!item_name || !category_id || !quantity || !unit || !minimum_threshold || !supplier_id) {
            return sendBadRequestResponse(res, "item_name, category_id, quantity, unit, minimum_threshold, and supplier_id are required");
        }

        // Check for existing item with same name in the same category
        const existingItem = await Item.findOne({ item_name, category_id });
        if (existingItem) {
            if (req.file) {
                const filePath = path.resolve(req.file.path);
                try {
                    await fs.promises.unlink(filePath);
                } catch (err) {
                    console.error("Failed to delete unused image:", err);
                }
            }
            return sendBadRequestResponse(res, "item_name already registered for this category.");
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
            imagePath = `/public/item_image/${req.file.filename}`;
        }

        const newItem = await Item.create({
            item_image: imagePath,
            item_name,
            category_id,
            price,
            quantity,
            unit,
            minimum_threshold,
            expiry_date,
            supplier_id,
            created_by: req.user ? req.user._id : undefined
        });

        return sendCreatedResponse(res, "Item created successfully", newItem);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get all items
export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({}).populate('category_id').populate('supplier_id');
        return sendSuccessResponse(res, "Items fetched successfully", items);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Get a single item by ID
export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid item ID format");
        }

        const item = await Item.findById(id).populate('category_id').populate('supplier_id');
        if (!item) {
            return sendErrorResponse(res, 404, "Item not found");
        }

        return sendSuccessResponse(res, "Item fetched successfully", item);
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};

// Update an item
export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return sendBadRequestResponse(res, "Invalid item ID format");
        }

        const item = await Item.findById(id);
        if (!item) {
            if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return sendErrorResponse(res, 404, "Item not found");
        }

        // --- Handle Image Replacement ---
        if (req.file) {
            const oldImagePath = item.item_image;
            if (oldImagePath && fs.existsSync(path.join(process.cwd(), oldImagePath))) {
                fs.unlinkSync(path.join(process.cwd(), oldImagePath));
            }
            item.item_image = `/public/item_image/${req.file.filename}`;
        }

        // --- Update Other Fields ---
        const { item_name, category_id, price, quantity, unit, minimum_threshold, expiry_date, supplier_id } = req.body;
        if (item_name) item.item_name = item_name;
        if (category_id) item.category_id = category_id;
        if (price) item.price = price;
        if (quantity) item.quantity = quantity;
        if (unit) item.unit = unit;
        if (minimum_threshold) item.minimum_threshold = minimum_threshold;
        if (expiry_date) item.expiry_date = expiry_date;
        if (supplier_id) item.supplier_id = supplier_id;

        await item.save();

        return sendSuccessResponse(res, "Item updated successfully", item);

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return ThrowError(res, 500, error.message);
    }
};

// Delete an item
export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendBadRequestResponse(res, "Invalid item ID format");
        }

        const itemToDelete = await Item.findById(id);
        if (!itemToDelete) {
            return sendErrorResponse(res, 404, "Item not found");
        }

        // Delete the associated image file if it exists
        if (itemToDelete.item_image) {
            const imagePath = path.join(process.cwd(), itemToDelete.item_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Item.findByIdAndDelete(id);

        return sendSuccessResponse(res, "Item deleted successfully");
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
};