import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    item_image: { type: String },
    item_name: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: {
        type: Number
    },
    quantity: { type: String, required: true },
    unit: { type: String, required: true },
    minimum_threshold: { type: Number, required: true },
    expiry_date: { type: Date },
    supplier_id: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Register" },
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);